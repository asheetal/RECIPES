
'use strict';
const { createHash } = require('node:crypto');

function scopeKey(scope) {
  if (!scope?.userId || !scope?.conversationId)
    throw Error('An owned conversation scope is required');
  return createHash('sha256').update(JSON.stringify([
    scope.tenantId || null,
    String(scope.userId),
    String(scope.conversationId),
  ])).digest('hex');
}

/**
 * Durable storage adapter.
 * State transitions are supplied by prompt management, not implemented here.
 */
class ChatStateRepository {
  constructor({ collection, createState, authorize }) {
    if (typeof authorize !== 'function') throw Error('Authorization port required');
    this.collection = collection;
    this.createState = createState;
    this.authorize = authorize;
  }

  async load(scope) {
    await this.authorize(scope);
    const key = scopeKey(scope);
    let document = await this.collection.findOne({ _id: key });
    if (!document) {
      const initial = await this.createState(scope);
      try {
        await this.collection.updateOne(
          { _id: key },
          { $setOnInsert: {
            scope: {
              tenantId: scope.tenantId || null,
              userId: String(scope.userId),
              conversationId: String(scope.conversationId),
            },
            version: 0,
            state: initial,
            updatedAt: new Date(),
          }},
          { upsert: true },
        );
      } catch (error) {
        if (error.code !== 11000) throw error;
      }
      document = await this.collection.findOne({ _id: key });
    }
    if (!document) throw Error('Conversation state unavailable');
    return document;
  }

  async read(scope) {
    return structuredClone((await this.load(scope)).state);
  }

  async change(scope, transition) {
    const key = scopeKey(scope);
    for (let attempt = 0; attempt < 16; attempt++) {
      const current = await this.load(scope);
      const draft = structuredClone(current.state);
      const result = transition(draft);
      if (result && typeof result.then === 'function')
        throw Error('State transitions must not perform asynchronous work');

      const changed = await this.collection.updateOne(
        { _id: key, version: current.version },
        {
          $set: { state: draft, updatedAt: new Date() },
          $inc: { version: 1 },
        },
      );
      if (changed.matchedCount === 1) return result;
    }
    throw Error('Concurrent state update; retry operation');
  }
}

/**
 * Internal compression checkpoints.
 * Keys include the owned chat, job and exact work-item identity.
 */
class CheckpointRepository {
  constructor({ collection, authorize }) {
    if (typeof authorize !== 'function') throw Error('Authorization port required');
    this.collection = collection;
    this.authorize = authorize;
  }

  key(scope, jobId, workKey) {
    if (!jobId || !workKey) throw Error('Checkpoint identity required');
    return createHash('sha256').update(JSON.stringify([
      scopeKey(scope), jobId, workKey,
    ])).digest('hex');
  }

  async get(scope, jobId, workKey) {
    await this.authorize(scope);
    const document = await this.collection.findOne({
      _id: this.key(scope, jobId, workKey),
    });
    return document ? structuredClone(document.result) : null;
  }

  async put(scope, jobId, workKey, result) {
    await this.authorize(scope);
    const id = this.key(scope, jobId, workKey);
    try {
      await this.collection.updateOne(
        { _id: id },
        { $setOnInsert: {
          scopeKey: scopeKey(scope),
          jobId,
          workKey,
          result: structuredClone(result),
          createdAt: new Date(),
        }},
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
    const stored = await this.collection.findOne({ _id: id });
    if (!stored) throw Error('Checkpoint was not persisted');
    return structuredClone(stored.result);
  }

  async removeJob(scope, jobId) {
    await this.authorize(scope);
    await this.collection.deleteMany({ scopeKey: scopeKey(scope), jobId });
  }
}

module.exports = { ChatStateRepository, CheckpointRepository };
