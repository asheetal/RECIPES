const readline=require("readline");
const assert=require("assert");
const {search}=require('./openalex-search.cjs');
const tool={
  name:"research_search",
  description:"Search academic papers using OpenAlex only. "+
    "No general web search or automatic web fallback is available through this tool.",
  inputSchema:{
    type:"object",
    properties:{
      query:{type:"string"},
      mode:{type:"string",enum:["academic"],default:"academic"}
    },
    required:["query"],additionalProperties:false
  }
};
async function dispatch(m) {
  if(m.method==="initialize") return {
    protocolVersion:"2024-11-05",capabilities:{tools:{}},
    serverInfo:{name:"lab-research-search",version:"3.0.0"}
  };
  if(m.method==="ping") return {};
  if(m.method==="tools/list") return {tools:[tool]};
  if(m.method==="tools/call") {
    if(m.params?.name!==tool.name) throw Error("Unknown tool.");
    try {
      return {content:[{
        type:"text",text:JSON.stringify(await search(m.params.arguments||{}))
      }]};
    } catch(e) {
      return {isError:true,content:[{type:"text",text:e.message}]};
    }
  }
  throw Error("Unsupported method.");
}
if(process.argv.includes('--self-test')) {
 require('./openalex-test.cjs');
} else {
  readline.createInterface({input:process.stdin}).on("line",async line=>{
    let m;
    try {m=JSON.parse(line);} catch {return;}
    if(m.id===undefined) return;
    try {
      process.stdout.write(JSON.stringify({
        jsonrpc:"2.0",id:m.id,result:await dispatch(m)
      })+"\n");
    } catch(e) {
      process.stdout.write(JSON.stringify({
        jsonrpc:"2.0",id:m.id,error:{code:-32601,message:e.message}
      })+"\n");
    }
  });
}
