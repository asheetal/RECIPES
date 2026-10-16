import{a as e,r as t}from"./rolldown-runtime.Cyuzqnbw.js";import{a as n,n as r,o as i}from"./http-client.CmQu8gfT.js";import{O as a,k as o}from"./codemirror-core.DCeggAsc.js";import{_ as s,a as c,b as l,c as u,d,f,g as p,h as m,i as h,l as g,m as _,n as ee,o as te,p as v,r as ne,s as y,u as b,v as x,y as S}from"./validation.BKpm4y3I.js";import{a as re}from"./mermaid.Dz-fdnux.js";import{_a as ie,ga as ae,ha as oe,va as se,ya as ce}from"./vendor.ItGBXXHI.js";i(),a();var le=Object.defineProperty,ue=(e,t)=>{let n={};for(var r in e)le(n,r,{get:e[r],enumerable:!0});return t||le(n,Symbol.toStringTag,{value:`Module`}),n},de=/^\${(.+)}$/,fe=new Set([`JWT_SECRET`,`JWT_REFRESH_SECRET`,`CREDS_KEY`,`CREDS_IV`,`MEILI_MASTER_KEY`,`MONGO_URI`,`REDIS_URI`,`REDIS_PASSWORD`]);function pe(e){return fe.has(e)}function C(e){if(!e)return e;let t=e.trim(),n=t.match(de);if(n){let e=n[1];return pe(e)?t:{}[e]||t}let r=/\${([^}]+)}/g,i=t,a=[],o;for(;(o=r.exec(t))!==null;)a.push({fullMatch:o[0],varName:o[1],index:o.index});for(let e=a.length-1;e>=0;e--){let{fullMatch:t,varName:n,index:r}=a[e];if(pe(n))continue;let o={}[n]||t;i=i.substring(0,r)+o+i.substring(r+t.length)}return i}function me(e=``){return e.toLowerCase()===`ollama`?`ollama`:e}var he=[`thumbsUp`,`thumbsDown`],ge=[`not_matched`,`inaccurate`,`bad_style`,`missing_image`,`unjustified_refusal`,`not_helpful`,`other`,`accurate_reliable`,`creative_solution`,`clear_well_written`,`attention_to_detail`],_e=[{key:`not_matched`,label:`com_ui_feedback_tag_not_matched`,direction:`thumbsDown`,icon:`AlertCircle`},{key:`inaccurate`,label:`com_ui_feedback_tag_inaccurate`,direction:`thumbsDown`,icon:`AlertCircle`},{key:`bad_style`,label:`com_ui_feedback_tag_bad_style`,direction:`thumbsDown`,icon:`PenTool`},{key:`missing_image`,label:`com_ui_feedback_tag_missing_image`,direction:`thumbsDown`,icon:`ImageOff`},{key:`unjustified_refusal`,label:`com_ui_feedback_tag_unjustified_refusal`,direction:`thumbsDown`,icon:`Ban`},{key:`not_helpful`,label:`com_ui_feedback_tag_not_helpful`,direction:`thumbsDown`,icon:`ThumbsDown`},{key:`other`,label:`com_ui_feedback_tag_other`,direction:`thumbsDown`,icon:`HelpCircle`},{key:`accurate_reliable`,label:`com_ui_feedback_tag_accurate_reliable`,direction:`thumbsUp`,icon:`CheckCircle`},{key:`creative_solution`,label:`com_ui_feedback_tag_creative_solution`,direction:`thumbsUp`,icon:`Lightbulb`},{key:`clear_well_written`,label:`com_ui_feedback_tag_clear_well_written`,direction:`thumbsUp`,icon:`PenTool`},{key:`attention_to_detail`,label:`com_ui_feedback_tag_attention_to_detail`,direction:`thumbsUp`,icon:`Search`}],ve=y(ge),ye=_({rating:y(he),tag:ve,text:p().max(1024).optional()});function be(e){if(!(!e?.rating||!e?.tag||!e.tag.key))return{rating:e.rating,tag:e.tag.key,text:e.text}}function xe(e){if(e)return _e.find(t=>t.key===e)}var Se=function(e){return e.execute_code=`execute_code`,e.code_interpreter=`code_interpreter`,e.file_search=`file_search`,e.web_search=`web_search`,e.retrieval=`retrieval`,e.function=`function`,e.memory=`memory`,e.ui_resources=`ui_resources`,e.skill=`skill`,e.read_file=`read_file`,e.bash_tool=`bash_tool`,e}({}),Ce=function(e){return e.code_interpreter=`code_interpreter`,e.execute_code=`execute_code`,e.file_search=`file_search`,e.image_edit=`image_edit`,e.context=`context`,e.ocr=`ocr`,e}({}),we=`_action_`,Te=`_mcp_`;function Ee(e){let t=e.indexOf(we);if(t<0)return!1;let n=e.indexOf(Te);return n<0||n<t}var De={order:`desc`,limit:100};p().uuid();var Oe=function(e){return e.OVERRIDE_AUTH=`override_auth`,e.USER_PROVIDED=`user_provided`,e.SYSTEM_DEFINED=`system_defined`,e}({}),ke=b(Oe),Ae=function(e){return e.azureOpenAI=`azureOpenAI`,e.openAI=`openAI`,e.google=`google`,e.anthropic=`anthropic`,e.assistants=`assistants`,e.azureAssistants=`azureAssistants`,e.agents=`agents`,e.custom=`custom`,e.bedrock=`bedrock`,e}({}),je=function(e){return e.OPENAI=`openAI`,e.ANTHROPIC=`anthropic`,e.AZURE=`azureOpenAI`,e.GOOGLE=`google`,e.VERTEXAI=`vertexai`,e.BEDROCK=`bedrock`,e.MISTRALAI=`mistralai`,e.MISTRAL=`mistral`,e.DEEPSEEK=`deepseek`,e.MOONSHOT=`moonshot`,e.OPENROUTER=`openrouter`,e.XAI=`xai`,e}({}),Me=new Set([`anthropic`,`openAI`,`bedrock`,`custom`,`google`,`vertexai`,`mistralai`,`mistral`,`deepseek`,`moonshot`,`openrouter`,`xai`]),Ne=new Set([`openAI`,`azureOpenAI`,`google`,`vertexai`,`xai`,`deepseek`,`openrouter`,`moonshot`,`anthropic`]),Pe=e=>Ne.has(e??``),Fe=e=>Me.has(e??``),Ie=new Set([`agents`,`openAI`,`bedrock`,`azureOpenAI`,`anthropic`,`custom`,`google`]),Le=function(e){return e.AI21=`ai21`,e.Amazon=`amazon`,e.Anthropic=`anthropic`,e.Cohere=`cohere`,e.DeepSeek=`deepseek`,e.Meta=`meta`,e.MistralAI=`mistral`,e.Moonshot=`moonshot`,e.MoonshotAI=`moonshotai`,e.OpenAI=`openai`,e.StabilityAI=`stability`,e.ZAI=`zai`,e}({}),Re=(e,t)=>{if(e===`bedrock`){let e=t.split(`.`);return[e[0],e[1]].find(e=>Object.values(Le).includes(e))??e[0]}return t},ze=(e,t)=>{let n=e;return[`${n}-${Re(n,t)}`,n]},Be=e=>{let t=e??``;return t?t.toLowerCase().endsWith(`assistants`):!1},Ve=e=>{let t=e??``;return t?t===`agents`:!1},He=(e,t)=>Ie.has(e)?!0:t==null?!1:Ie.has(t),Ue=function(e){return e.low=`low`,e.auto=`auto`,e.high=`high`,e}({}),We=function(e){return e.unset=``,e.none=`none`,e.minimal=`minimal`,e.low=`low`,e.medium=`medium`,e.high=`high`,e.xhigh=`xhigh`,e}({}),Ge=function(e){return e.disabled=`disabled`,e.reasoningEffort=`reasoning_effort`,e.reasoningObject=`reasoning_object`,e}({}),Ke=function(e){return e.reasoning=`reasoning`,e.reasoningContent=`reasoning_content`,e}({}),qe=function(e){return e.unset=``,e.low=`low`,e.medium=`medium`,e.high=`high`,e.xhigh=`xhigh`,e.max=`max`,e}({}),Je=function(e){return e.auto=`auto`,e.summarized=`summarized`,e.omitted=`omitted`,e}({}),Ye=function(e){return e.low=`low`,e.medium=`medium`,e.high=`high`,e}({}),Xe=function(e){return e.none=``,e.auto=`auto`,e.concise=`concise`,e.detailed=`detailed`,e}({}),Ze=function(e){return e.none=``,e.low=`low`,e.medium=`medium`,e.high=`high`,e}({}),Qe=function(e){return e.unset=``,e.minimal=`minimal`,e.low=`low`,e.medium=`medium`,e.high=`high`,e}({}),$e=b(Ue),et=b(We),tt=b(Ge),nt=b(Ke),rt=b(qe),it=b(Je),at=b(Xe),ot=b(Ze),st=b(Qe),ct={assistant:``,id:``,name:``,description:``,instructions:``,conversation_starters:[],model:``,functions:[],code_interpreter:!1,image_vision:!1,retrieval:!1,append_current_datetime:!1},lt={agent:{},id:``,name:``,description:``,instructions:``,model:``,model_parameters:{},tools:[],tool_options:{},provider:{},edges:[],artifacts:``,recursion_limit:void 0,execute_code:!1,file_search:!1,web_search:!1,category:`general`,support_contact:{name:``,email:``},skills:void 0,skills_enabled:void 0,subagents:void 0},ut={type:`function`,function:{name:`image_vision`,description:`Get detailed text descriptions for all current image attachments.`,parameters:{type:`object`,properties:{},required:[]}}},dt=e=>e.type===`function`&&e.function?.name===ut.function?.name,w={model:{default:`gpt-4o-mini`},temperature:{min:0,max:2,step:.01,default:1},top_p:{min:0,max:1,step:.01,default:1},presence_penalty:{min:-2,max:2,step:.01,default:0},frequency_penalty:{min:-2,max:2,step:.01,default:0},resendFiles:{default:!0},maxContextTokens:{default:void 0},max_tokens:{default:void 0},imageDetail:{default:`auto`,min:0,max:2,step:1}},ft=65535,pt=32768,mt=8192,ht=e=>/gemini-(?:2\.5|[3-9]|\d{2,})/i.test(e)?/image/i.test(e)?pt:ft:mt,T={model:{default:`gemini-1.5-flash-latest`},maxOutputTokens:{min:1,max:ft,step:1,default:mt,reset:e=>ht(e),set:(e,t)=>{let n=ht(t);return e>n?n:e}},temperature:{min:0,max:2,step:.01,default:1},topP:{min:0,max:1,step:.01,default:.95},topK:{min:1,max:40,step:1,default:40},thinking:{default:!0},thinkingBudget:{min:-1,max:32e3,step:1,default:-1},thinkingLevel:{default:``}},gt=128e3,_t=64e3,vt=32e3,yt=8192,bt=4096,xt=RegExp(`claude-(?:${[`fable`,`mythos`].join(`|`)})[-.]?\\d`);function St(e){return xt.test(e)}var E={model:{default:`claude-3-5-sonnet-latest`},temperature:{min:0,max:1,step:.01,default:1},promptCache:{default:!0},promptCacheTtl:{default:void 0},thinking:{default:!0},thinkingBudget:{min:1024,step:100,max:2e5,default:2e3},maxOutputTokens:{min:1,max:gt,step:1,default:yt,reset:e=>St(e)||/claude-opus[-.]?(?:4[-.]?(?:[6-9]|\d{2,})|[5-9]|\d{2,})/.test(e)?gt:/claude-(?:sonnet|haiku)[-.]?[4-9]/.test(e)||/claude-opus[-.]?(?:[5-9]|4[-.]?([5-9]|\d{2,}))/.test(e)?_t:/claude-opus[-.]?[4-9]/.test(e)?vt:yt,set:(e,t)=>St(t)||/claude-opus[-.]?(?:4[-.]?(?:[6-9]|\d{2,})|[5-9]|\d{2,})/.test(t)?e>gt?gt:e:/claude-(?:sonnet|haiku)[-.]?[4-9]/.test(t)&&e>_t?_t:/claude-opus[-.]?(?:[5-9]|4[-.]?([5-9]|\d{2,}))/.test(t)?e>_t?_t:e:/claude-opus[-.]?[4-9]/.test(t)&&e>vt?vt:e>gt?gt:e},topP:{min:0,max:1,step:.01,default:.7},topK:{min:1,max:40,step:1,default:5},resendFiles:{default:!0},maxContextTokens:{default:void 0},legacy:{maxOutputTokens:{min:1,max:bt,step:1,default:bt}},effort:{default:``,options:[``,`low`,`medium`,`high`,`xhigh`,`max`]},thinkingDisplay:{default:`auto`,options:[`auto`,`summarized`,`omitted`]},web_search:{default:!1}},Ct={model:{default:`gpt-3.5-turbo-test`},temperature:{min:0,max:1,step:.01,default:1},top_p:{min:0,max:1,step:.01,default:1},presence_penalty:{min:-2,max:2,step:.01,default:0},frequency_penalty:{min:-2,max:2,step:.01,default:0},resendFiles:{default:!0},maxContextTokens:{default:void 0},max_tokens:{default:void 0},imageDetail:{default:`auto`}},wt={openAI:w,google:T,anthropic:E,agents:Ct,bedrock:Ct}.google,D=b(Ae),Tt=x([D,p()]),Et=_({authField:p(),label:p(),description:p(),optional:c().optional(),sensitive:c().optional()}),Dt=_({name:p(),pluginKey:p(),description:p().optional(),icon:p().optional(),authConfig:h(Et).optional(),authenticated:c().optional(),chatMenu:c().optional(),isButton:c().optional(),toolkit:c().optional()}),Ot=_({input:_({content:p()}),output:_({content:p()})}),kt=_({messageId:p(),endpoint:p().optional(),clientId:p().nullable().optional(),conversationId:p().nullable(),parentMessageId:p().nullable(),responseMessageId:p().nullable().optional(),overrideParentMessageId:p().nullable().optional(),bg:p().nullable().optional(),model:p().nullable().optional(),title:p().nullable().or(g(`New Chat`)).default(`New Chat`),sender:p().optional(),text:p(),generation:p().nullable().optional(),isCreatedByUser:c(),isTemporary:c().optional(),expiredAt:p().nullable().optional(),error:c().optional(),clientTimestamp:p().optional(),createdAt:p().optional().default(()=>new Date().toISOString()),updatedAt:p().optional().default(()=>new Date().toISOString()),current:c().optional(),unfinished:c().optional(),searchResult:c().optional(),finish_reason:p().optional(),thread_id:p().optional(),iconURL:p().nullable().optional(),feedback:ye.optional(),metadata:m(S()).optional(),tokenCount:v().optional(),contextMeta:_({calibrationRatio:v().optional().describe(`EMA ratio of provider-reported vs local token estimates; seeds the pruner on subsequent runs`),encoding:p().optional().describe(`Tokenizer encoding used when this ratio was computed (e.g. "claude", "o200k_base")`)}).optional(),manualSkills:h(p()).optional(),alwaysAppliedSkills:h(p()).optional(),quotes:h(p()).optional()}),O=x([v(),p()]).transform(e=>typeof e==`string`?e.trim()===``?void 0:parseFloat(e):e),At=u(()=>x([f(),c(),v(),p(),h(u(()=>At)),m(u(()=>At))])),k=_({conversationId:p().nullable(),endpoint:D.nullable(),endpointType:D.nullable().optional(),isArchived:c().optional(),pinned:c().optional(),title:p().nullable().or(g(`New Chat`)).default(`New Chat`),user:p().optional(),messages:h(p()).optional(),tools:x([h(Dt),h(p())]).optional(),modelLabel:p().nullable().optional(),userLabel:p().optional(),model:p().nullable().optional(),promptPrefix:p().nullable().optional(),temperature:v().nullable().optional(),topP:v().optional(),topK:v().optional(),top_p:v().optional(),frequency_penalty:v().optional(),presence_penalty:v().optional(),parentMessageId:p().optional(),maxOutputTokens:O.nullable().optional(),maxContextTokens:O.optional(),max_tokens:O.optional(),promptCache:c().optional(),promptCacheTtl:y([`5m`,`1h`]).optional(),system:p().optional(),thinking:c().optional(),thinkingBudget:O.optional(),thinkingLevel:st.optional(),stream:c().optional(),artifacts:p().optional(),context:p().nullable().optional(),examples:h(Ot).optional(),tags:h(p()).optional(),chatProjectId:p().nullable().optional(),createdAt:p(),updatedAt:p(),resendFiles:c().optional(),file_ids:h(p()).optional(),imageDetail:$e.optional(),reasoning_effort:et.optional().nullable(),reasoning_summary:at.optional().nullable(),verbosity:ot.optional().nullable(),useResponsesApi:c().optional(),effort:rt.optional().nullable(),thinkingDisplay:it.optional().nullable(),web_search:c().optional(),url_context:c().optional(),disableStreaming:c().optional(),assistant_id:p().optional(),agent_id:p().optional(),region:p().optional(),maxTokens:O.optional(),additionalModelRequestFields:At.optional(),instructions:p().optional(),additional_instructions:p().optional(),append_current_datetime:c().optional(),presetOverride:m(S()).optional(),stop:h(p()).optional(),greeting:p().optional(),spec:p().nullable().optional(),iconURL:p().nullable().optional(),expiredAt:p().nullable().optional(),isTemporary:c().optional(),fileTokenLimit:O.optional(),resendImages:c().optional(),chatGptLabel:p().nullable().optional()}),jt=k.omit({conversationId:!0,chatProjectId:!0,createdAt:!0,updatedAt:!0,title:!0}).merge(_({conversationId:p().nullable().optional(),presetId:p().nullable().optional(),title:p().nullable().optional(),defaultPreset:c().optional(),order:v().optional(),endpoint:Tt.nullable()})),Mt=k.merge(_({endpoint:Tt.nullable(),createdAt:p().optional(),updatedAt:p().optional()})),Nt=k.pick({spec:!0,maxContextTokens:!0,resendFiles:!0,imageDetail:!0,promptPrefix:!0,model:!0,temperature:!0,presence_penalty:!0,frequency_penalty:!0,stop:!0,top_p:!0,max_tokens:!0,reasoning_effort:!0,reasoning_summary:!0,verbosity:!0,useResponsesApi:!0,web_search:!0,url_context:!0,disableStreaming:!0,topP:!0,topK:!0,maxOutputTokens:!0,promptCache:!0,promptCacheTtl:!0,thinking:!0,thinkingBudget:!0,thinkingLevel:!0,effort:!0,thinkingDisplay:!0,region:!0,maxTokens:!0,agent_id:!0,assistant_id:!0,append_current_datetime:!0,instructions:!0,fileTokenLimit:!0}).merge(_({endpoint:Tt.nullable()})),Pt=jt.omit({conversationId:!0,presetId:!0,title:!0,defaultPreset:!0,order:!0,isArchived:!0,user:!0,messages:!0,tags:!0,file_ids:!0,expiredAt:!0,parentMessageId:!0,resendImages:!0,chatGptLabel:!0,presetOverride:!0,spec:!0});_({conversationId:p(),shareId:p(),targetMessageId:p().optional(),messages:h(p()),title:p(),createdAt:p(),updatedAt:p()}),_({_id:p(),user:p(),tag:p(),description:p().optional(),createdAt:p(),updatedAt:p(),count:v(),position:v()});var Ft=k.pick({chatProjectId:!0,model:!0,modelLabel:!0,promptPrefix:!0,examples:!0,temperature:!0,maxOutputTokens:!0,artifacts:!0,topP:!0,topK:!0,thinking:!0,thinkingBudget:!0,thinkingLevel:!0,web_search:!0,url_context:!0,fileTokenLimit:!0,iconURL:!0,greeting:!0,spec:!0,maxContextTokens:!0}),It=Ft.transform(e=>A(e,!0)).catch(()=>({}));_({maxOutputTokens:O.optional(),temperature:O.optional(),topP:O.optional(),topK:O.optional(),presencePenalty:O.optional(),frequencyPenalty:O.optional(),stopSequences:h(p()).optional(),thinkingConfig:_({includeThoughts:c().optional(),thinkingBudget:O.optional(),thinkingLevel:p().optional()}).optional(),web_search:c().optional(),url_context:c().optional()}).strip().optional();function A(e,t){let n={...e};return Object.keys(n).forEach(e=>{let r=n[e];r??delete n[e],t&&typeof r==`string`&&r===``&&delete n[e]}),n}var Lt=k.pick({chatProjectId:!0,model:!0,assistant_id:!0,instructions:!0,artifacts:!0,promptPrefix:!0,iconURL:!0,greeting:!0,spec:!0,append_current_datetime:!0}).transform(e=>({...e,model:e.model??w.model.default,assistant_id:e.assistant_id??void 0,instructions:e.instructions??void 0,promptPrefix:e.promptPrefix??null,iconURL:e.iconURL??void 0,greeting:e.greeting??void 0,spec:e.spec??void 0,append_current_datetime:e.append_current_datetime??!1})).catch(()=>({model:w.model.default,assistant_id:void 0,instructions:void 0,promptPrefix:null,iconURL:void 0,greeting:void 0,spec:void 0,append_current_datetime:!1})),Rt=k.pick({chatProjectId:!0,model:!0,assistant_id:!0,instructions:!0,promptPrefix:!0,artifacts:!0,iconURL:!0,greeting:!0,spec:!0}).transform(e=>A(e)).catch(()=>({}));k.pick({chatProjectId:!0,model:!0,modelLabel:!0,temperature:!0,top_p:!0,presence_penalty:!0,frequency_penalty:!0,resendFiles:!0,imageDetail:!0,agent_id:!0,instructions:!0,promptPrefix:!0,iconURL:!0,greeting:!0,maxContextTokens:!0}).transform(e=>({...e,model:e.model??Ct.model.default,modelLabel:e.modelLabel??null,temperature:e.temperature??1,top_p:e.top_p??1,presence_penalty:e.presence_penalty??0,frequency_penalty:e.frequency_penalty??0,resendFiles:typeof e.resendFiles==`boolean`?e.resendFiles:Ct.resendFiles.default,imageDetail:e.imageDetail??`auto`,agent_id:e.agent_id??void 0,instructions:e.instructions??void 0,promptPrefix:e.promptPrefix??null,iconURL:e.iconURL??void 0,greeting:e.greeting??void 0,maxContextTokens:e.maxContextTokens??void 0})).catch(()=>({model:Ct.model.default,modelLabel:null,temperature:1,top_p:1,presence_penalty:0,frequency_penalty:0,resendFiles:Ct.resendFiles.default,imageDetail:`auto`,agent_id:void 0,instructions:void 0,promptPrefix:null,iconURL:void 0,greeting:void 0,maxContextTokens:void 0}));var zt=k.pick({chatProjectId:!0,model:!0,modelLabel:!0,chatGptLabel:!0,promptPrefix:!0,temperature:!0,top_p:!0,presence_penalty:!0,frequency_penalty:!0,resendFiles:!0,artifacts:!0,imageDetail:!0,stop:!0,iconURL:!0,greeting:!0,spec:!0,maxContextTokens:!0,max_tokens:!0,reasoning_effort:!0,reasoning_summary:!0,verbosity:!0,useResponsesApi:!0,web_search:!0,disableStreaming:!0,fileTokenLimit:!0}),j=zt.transform(e=>A(e,!0)).catch(()=>({})),Bt=zt.merge(k.pick({promptCache:!0,promptCacheTtl:!0})).transform(e=>A(e,!0)).catch(()=>({})),Vt=Ft.transform(e=>{let t={...e};return t.temperature===wt.temperature.default&&delete t.temperature,t.maxOutputTokens===wt.maxOutputTokens.reset(t.model??``)&&delete t.maxOutputTokens,t.topP===wt.topP.default&&delete t.topP,t.topK===wt.topK.default&&delete t.topK,A(t,!0)}).catch(()=>({})),Ht=k.pick({chatProjectId:!0,model:!0,modelLabel:!0,promptPrefix:!0,temperature:!0,maxOutputTokens:!0,topP:!0,topK:!0,resendFiles:!0,promptCache:!0,promptCacheTtl:!0,thinking:!0,thinkingBudget:!0,effort:!0,thinkingDisplay:!0,artifacts:!0,iconURL:!0,greeting:!0,spec:!0,maxContextTokens:!0,web_search:!0,fileTokenLimit:!0,stop:!0,stream:!0}).transform(e=>A(e)).catch(()=>({}));_({bannerId:p(),message:p(),displayFrom:p(),displayTo:p(),createdAt:p(),updatedAt:p(),isPublic:c(),persistable:c().default(!1)});var Ut=k.pick({chatProjectId:!0,spec:!0,iconURL:!0,greeting:!0,agent_id:!0,instructions:!0,additional_instructions:!0}).transform(e=>A(e)).catch(()=>({})),Wt=function(e){return e.Input=`input`,e.Textarea=`textarea`,e.Slider=`slider`,e.Checkbox=`checkbox`,e.Switch=`switch`,e.Dropdown=`dropdown`,e.Combobox=`combobox`,e.Tags=`tags`,e}({}),Gt=function(e){return e.Number=`number`,e.Boolean=`boolean`,e.String=`string`,e.Enum=`enum`,e.Array=`array`,e}({}),Kt=function(e){return e.Conversation=`conversation`,e.Model=`model`,e.Custom=`custom`,e}({}),qt=_({enabled:c().optional(),allowSelf:c().optional(),agent_ids:h(p()).max(10).optional()}),Jt=_({name:p(),label:p(),preset:Pt,order:v().optional(),default:c().optional(),softDefault:c().optional(),description:p().optional(),group:p().optional(),groupIcon:x([p(),D]).optional(),showIconInMenu:c().optional(),showIconInHeader:c().optional(),showOnLanding:c().optional(),conversation_starters:h(p()).optional(),iconURL:x([p(),D]).optional(),authType:ke.optional(),hideBadgeRow:c().optional(),webSearch:c().optional(),fileSearch:c().optional(),executeCode:c().optional(),artifacts:x([p(),c()]).optional(),mcpServers:h(p()).optional(),skills:x([c(),h(p())]).optional(),subagents:qt.optional()}),Yt=_({enforce:c().default(!1),prioritize:c().default(!0),list:h(Jt).default([]),addedEndpoints:h(x([p(),D])).optional()}),Xt=[`seconds`,`minutes`,`hours`,`days`,`weeks`,`months`];function Zt(e,t,n){let r=new Date(e);switch(n){case`seconds`:return r.setSeconds(r.getSeconds()+t),r;case`minutes`:return r.setMinutes(r.getMinutes()+t),r;case`hours`:return r.setHours(r.getHours()+t),r;case`days`:return r.setDate(r.getDate()+t),r;case`weeks`:return r.setDate(r.getDate()+t*7),r;case`months`:return r.setMonth(r.getMonth()+t),r;default:return r}}var Qt={openAI:!0,google:!0,assistants:!0,azureAssistants:!0,agents:!0,azureOpenAI:!0,anthropic:!0,custom:!0,bedrock:!0},$t=[`application/vnd.ms-excel`,`application/msexcel`,`application/x-msexcel`,`application/x-ms-excel`,`application/x-excel`,`application/x-dos_ms_excel`,`application/xls`,`application/x-xls`,`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`];[...$t],[...$t];var en=/\.(jpg|jpeg|png|gif|webp|heic|heif)$/i,tn={"application/pdf":`pdf`,"text/csv":`csv`,"application/csv":`csv`,"application/msword":`doc`,"application/vnd.openxmlformats-officedocument.wordprocessingml.document":`docx`,"application/vnd.ms-excel":`xls`,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":`xlsx`,"text/html":`html`,"text/plain":`txt`,"text/markdown":`md`},nn=e=>e!=null&&e in tn,rn=`.pdf,.csv,.doc,.docx,.xls,.xlsx,.html,.htm,.txt,.md,application/pdf,text/csv,application/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/html,text/plain,text/markdown`,an=/^application\/(vnd\.ms-excel|msexcel|x-msexcel|x-ms-excel|x-excel|x-dos_ms_excel|xls|x-xls|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/,on=/^(text\/(x-c|x-csharp|tab-separated-values|x-c\+\+|x-h|x-java|html|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain|css|vtt|javascript|csv|xml|calendar))$/,sn=/^(application\/(epub\+zip|csv|json|msword|pdf|x-tar|x-sh|x-zip-compressed|typescript|sql|yaml|x-parquet|vnd\.apache\.parquet|vnd\.coffeescript|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation|spreadsheetml\.sheet)|vnd\.oasis\.opendocument\.(text|spreadsheet|presentation|graphics)|xml|zip))$/,cn=/^image\/(jpeg|gif|png|webp|heic|heif)$/,ln=/^audio\/(mp3|mpeg|mpeg3|wav|wave|x-wav|ogg|vorbis|mp4|m4a|x-m4a|flac|x-flac|webm|aac|wma|opus)$/,un=/^video\/(mp4|avi|mov|wmv|flv|webm|mkv|m4v|3gp|ogv)$/,dn=[cn,an,/^application\/pdf$/,/^application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation)$/,/^application\/vnd\.ms-(word|powerpoint)$/,/^application\/epub\+zip$/,/^application\/vnd\.oasis\.opendocument\.(text|spreadsheet|presentation|graphics)$/],fn=[/^[\w.-]+\/[\w.-]+$/],pn=[ln],mn=[on,an,sn,cn,un,ln,/^image\/(svg|svg\+xml)$/],hn={c:`text/x-c`,cs:`text/x-csharp`,cpp:`text/x-c++`,h:`text/x-h`,md:`text/markdown`,php:`text/x-php`,py:`text/x-python`,rb:`text/x-ruby`,tex:`text/x-tex`,java:`text/x-java`,js:`text/javascript`,sh:`application/x-sh`,ts:`application/typescript`,tar:`application/x-tar`,zip:`application/zip`,txt:`text/plain`,log:`text/plain`,csv:`text/csv`,tsv:`text/tab-separated-values`,parquet:`application/x-parquet`,json:`application/json`,xml:`application/xml`,html:`text/html`,htm:`text/html`,css:`text/css`,yml:`application/yaml`,yaml:`application/yaml`,sql:`application/sql`,dart:`text/plain`,coffee:`application/vnd.coffeescript`,go:`text/plain`,rs:`text/plain`,swift:`text/plain`,kt:`text/plain`,kts:`text/plain`,scala:`text/plain`,lua:`text/plain`,r:`text/plain`,pl:`text/plain`,pm:`text/plain`,groovy:`text/plain`,gradle:`text/plain`,clj:`text/plain`,cljs:`text/plain`,cljc:`text/plain`,elm:`text/plain`,erl:`text/plain`,hrl:`text/plain`,ex:`text/plain`,exs:`text/plain`,hs:`text/plain`,lhs:`text/plain`,ml:`text/plain`,mli:`text/plain`,fs:`text/plain`,fsx:`text/plain`,lisp:`text/plain`,cl:`text/plain`,scm:`text/plain`,rkt:`text/plain`,jsx:`text/plain`,tsx:`text/plain`,vue:`text/plain`,svelte:`text/plain`,astro:`text/plain`,scss:`text/plain`,sass:`text/plain`,less:`text/plain`,styl:`text/plain`,toml:`text/plain`,ini:`text/plain`,cfg:`text/plain`,conf:`text/plain`,env:`text/plain`,properties:`text/plain`,graphql:`text/plain`,gql:`text/plain`,proto:`text/plain`,dockerfile:`text/plain`,makefile:`text/plain`,cmake:`text/plain`,rake:`text/plain`,gemspec:`text/plain`,bash:`text/plain`,zsh:`text/plain`,fish:`text/plain`,ps1:`text/plain`,psm1:`text/plain`,bat:`text/plain`,cmd:`text/plain`,asm:`text/plain`,s:`text/plain`,v:`text/plain`,zig:`text/plain`,nim:`text/plain`,cr:`text/plain`,d:`text/plain`,pas:`text/plain`,pp:`text/plain`,f90:`text/plain`,f95:`text/plain`,f03:`text/plain`,jl:`text/plain`,m:`text/plain`,mm:`text/plain`,ada:`text/plain`,adb:`text/plain`,ads:`text/plain`,cob:`text/plain`,cbl:`text/plain`,tcl:`text/plain`,awk:`text/plain`,sed:`text/plain`,odt:`application/vnd.oasis.opendocument.text`,ods:`application/vnd.oasis.opendocument.spreadsheet`,odp:`application/vnd.oasis.opendocument.presentation`,odg:`application/vnd.oasis.opendocument.graphics`,ics:`text/calendar`,ical:`text/calendar`,ifb:`text/calendar`,icalendar:`text/calendar`},gn={heic:`image/heic`,heif:`image/heif`},_n={"application/x-zip-compressed":`application/zip`,"text/x-python-script":`text/x-python`,"text/x-markdown":`text/markdown`};function vn(e,t){if(t)return _n[t]??t;let n=e.split(`.`).pop()?.toLowerCase()??``;return hn[n]||gn[n]||t}var yn=[/^(text\/(x-c|x-c\+\+|x-h|html|x-java|markdown|x-php|x-python|x-script\.python|x-ruby|x-tex|plain|vtt|xml))$/,/^(application\/(json|pdf|vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|presentationml\.presentation)))$/],bn=1024*1024,M=e=>e*bn,xn=M(512),Sn=M(50),Cn=1e5,wn={fileLimit:10,fileSizeLimit:xn,totalSizeLimit:xn,supportedMimeTypes:mn,disabled:!1},N={endpoints:{assistants:wn,azureAssistants:wn,agents:wn,anthropic:{fileLimit:10,fileSizeLimit:xn,totalSizeLimit:xn,supportedMimeTypes:mn,disabled:!1},default:{fileLimit:10,fileSizeLimit:xn,totalSizeLimit:xn,supportedMimeTypes:mn,disabled:!1}},skills:{fileSizeLimit:Sn},serverFileSizeLimit:xn,avatarSizeLimit:M(2),fileTokenLimit:Cn,clientImageResize:{enabled:!1,maxWidth:1900,maxHeight:1900,quality:.92},ocr:{supportedMimeTypes:dn},text:{supportedMimeTypes:fn},stt:{supportedMimeTypes:pn},checkType:function(e,t=mn){return t.some(t=>t.test(e))}},Tn=h(p()).optional(),En=_({disabled:c().optional(),fileLimit:v().min(0).optional(),fileSizeLimit:v().min(0).optional(),totalSizeLimit:v().min(0).optional(),supportedMimeTypes:Tn.optional()}),Dn=_({fileSizeLimit:v().min(0).optional()}),On=_({endpoints:m(En).optional(),skills:Dn.optional(),serverFileSizeLimit:v().min(0).optional(),avatarSizeLimit:v().min(0).optional(),fileTokenLimit:v().min(0).optional(),imageGeneration:_({percentage:v().min(0).max(100).optional(),px:v().min(0).optional()}).optional(),clientImageResize:_({enabled:c().optional(),maxWidth:v().min(0).optional(),maxHeight:v().min(0).optional(),quality:v().min(0).max(1).optional()}).optional(),ocr:_({supportedMimeTypes:Tn.optional()}).optional(),text:_({supportedMimeTypes:Tn.optional()}).optional()}),kn=e=>e.reduce((e,t)=>{try{let n=new RegExp(t);e.push(n)}catch(e){console.error(`Invalid regex pattern "${t}" skipped.`,e)}return e},[]),An=e=>!e||e.length===0?!1:e.some(e=>e.test(`x-librechat/x-probe`));function P(e,t,n){let r=Fe(n)?mn:t.supportedMimeTypes;return{disabled:e.disabled??t.disabled,fileLimit:e.fileLimit??t.fileLimit,fileSizeLimit:e.fileSizeLimit??t.fileSizeLimit,totalSizeLimit:e.totalSizeLimit??t.totalSizeLimit,supportedMimeTypes:e.supportedMimeTypes??r}}function jn(e){let{fileConfig:t,endpoint:n,endpointType:r}=e;if(!t?.endpoints)return N.endpoints.default;let i=N.endpoints.default,a=t.endpoints.default,o=a?P(a,i,`default`):i,s=me(n??``),c=new Set([`default`,`agents`,`assistants`,`azureAssistants`,`openAI`,`azureOpenAI`,`anthropic`,`google`,`bedrock`]),l=me(r??``);if(r===`custom`||!c.has(l)&&s&&!c.has(s)){if(n&&t.endpoints[n])return P(t.endpoints[n],o,n);for(let e in t.endpoints)if(!c.has(e)&&me(e)===s)return P(t.endpoints[e],o,e);return t.endpoints.custom?P(t.endpoints.custom,o,n):t.endpoints.agents?P(t.endpoints.agents,o,n):o}return r&&t.endpoints[r]?P(t.endpoints[r],o,r):n&&t.endpoints[n]?P(t.endpoints[n],o,n):s&&t.endpoints[s]?P(t.endpoints[s],o,s):Ve(l||s)&&t.endpoints.agents?P(t.endpoints.agents,o,`agents`):o}function Mn(e){let t={...N,endpoints:{...N.endpoints},skills:{...N.skills},ocr:{...N.ocr,supportedMimeTypes:N.ocr?.supportedMimeTypes||[]},text:{...N.text,supportedMimeTypes:N.text?.supportedMimeTypes||[]},stt:{...N.stt,supportedMimeTypes:N.stt?.supportedMimeTypes||[]}};if(!e)return t;if(e.serverFileSizeLimit!==void 0&&(t.serverFileSizeLimit=M(e.serverFileSizeLimit)),e.avatarSizeLimit!==void 0&&(t.avatarSizeLimit=M(e.avatarSizeLimit)),e.fileTokenLimit!==void 0&&(t.fileTokenLimit=e.fileTokenLimit),e.skills?.fileSizeLimit!==void 0&&(t.skills={...t.skills,fileSizeLimit:M(e.skills.fileSizeLimit)}),e.clientImageResize!==void 0&&(t.clientImageResize={...t.clientImageResize,...e.clientImageResize}),e.ocr!==void 0){let{supportedMimeTypes:n,...r}=e.ocr;t.ocr={...t.ocr,...r},n&&(t.ocr.supportedMimeTypes=kn(n))}if(e.text!==void 0){let{supportedMimeTypes:n,...r}=e.text;t.text={...t.text,...r},n&&(t.text.supportedMimeTypes=kn(n))}if(!e.endpoints)return t;for(let n in e.endpoints){let r=e.endpoints[n];t.endpoints[n]?t.endpoints[n]={...t.endpoints[n]}:t.endpoints[n]={};let i=t.endpoints[n];if(r.disabled===!0){i.disabled=!0,i.fileLimit=0,i.fileSizeLimit=0,i.totalSizeLimit=0,i.supportedMimeTypes=[];continue}r.fileSizeLimit!==void 0&&(i.fileSizeLimit=M(r.fileSizeLimit)),r.totalSizeLimit!==void 0&&(i.totalSizeLimit=M(r.totalSizeLimit)),[`fileLimit`].forEach(e=>{r[e]!==void 0&&(i[e]=r[e])}),r.disabled!==void 0&&(i.disabled=r.disabled),r.supportedMimeTypes&&(i.supportedMimeTypes=kn(r.supportedMimeTypes))}return t}var F=``;(o===void 0||o.browser===!0)&&(F=document.querySelector(`base`)?.getAttribute(`href`)||`/`),F&&F.endsWith(`/`)&&(F=F.slice(0,-1));var I=()=>F,Nn=e=>{let t=Object.entries(e).filter(([,e])=>Array.isArray(e)?e.length>0:e!=null&&e!==``).map(([e,t])=>Array.isArray(t)?t.map(t=>`${e}=${encodeURIComponent(t)}`).join(`&`):`${e}=${encodeURIComponent(String(t))}`).join(`&`);return t?`?${t}`:``},Pn=()=>`${F}/health`,Fn=()=>`${F}/api/user`,In=()=>`${F}/api/balance`,Ln=()=>`${F}/api/user/plugins`,Rn=()=>`${F}/api/user/delete`,zn=`${F}/api/messages`,Bn=e=>{let{conversationId:t,messageId:n,...r}=e;return t&&n?`${zn}/${t}/${n}`:t?`${zn}/${t}`:`${zn}${Nn(r)}`},Vn=e=>`${zn}/artifact/${e}`,Hn=()=>`${zn}/branch`,Un=`${F}/api/share`,Wn=e=>`${Un}/${e}`,Gn=e=>`${Wn(e)}/config`,Kn=e=>`${Un}/link/${e}`,qn=(e,t,n,r,i)=>`${Un}?pageSize=${e}&sortBy=${t}&sortDirection=${n}${r?`&search=${r}`:``}${i?`&cursor=${i}`:``}`,Jn=e=>`${Un}/${e}`,Yn=e=>`${Un}/${e}`,Xn=(e,t)=>`${Un}/${e}/files/${encodeURIComponent(t)}`,Zn=(e,t)=>`${Xn(e,t)}/download`,Qn=(e,t)=>`${Xn(e,t)}/preview`,$n=`${F}/api/keys`,er=()=>$n,tr=e=>`${$n}?name=${e}`,nr=e=>`${$n}/${e}`,rr=()=>`${$n}?all=true`,ir=`${F}/api/api-keys`,ar=()=>ir,or=e=>`${ir}/${e}`,L=`${F}/api/convos`,sr=e=>`${L}${Nn(e)}`,cr=e=>`${L}/${e}`,lr=e=>`${L}/gen_title/${encodeURIComponent(e)}`,ur=()=>`${L}/update`,dr=()=>`${L}/archive`,fr=()=>`${L}/pin`,pr=()=>`${L}`,mr=()=>`${L}/all`,hr=()=>`${L}/import`,gr=()=>`${L}/fork`,_r=()=>`${L}/duplicate`,vr=`${F}/api/projects`,yr=(e={})=>`${vr}${Nn(e)}`,br=e=>`${vr}/${encodeURIComponent(e)}`,xr=e=>`${vr}/conversations/${encodeURIComponent(e)}`,Sr=()=>`${F}/api/search/enable`,Cr=()=>`${F}/api/presets`,wr=()=>`${F}/api/presets/delete`,Tr=()=>`${F}/api/endpoints`,Er=()=>`${F}/api/endpoints/token-config`,Dr=()=>`${F}/api/endpoints/context-projection`,Or=()=>`${F}/api/models`,kr=()=>`${F}/api/tokenizer`,Ar=()=>`${F}/api/auth/login`,jr=()=>`${F}/api/auth/logout`,Mr=()=>`${F}/api/auth/register`,Nr=()=>`${F}/api/auth/google`,Pr=e=>`${F}/api/auth/refresh${e===!0?`?retry=true`:``}`,Fr=()=>`${F}/api/auth/requestPasswordReset`,Ir=()=>`${F}/api/auth/resetPassword`,Lr=()=>`${F}/api/user/verify`,Rr=()=>`${F}/login`,zr=()=>`${F}/register`,Br=`redirect_to`,Vr=/(?:^|\/)login(?:\/|$)/;function Hr(e,t,n){let r=e??window.location.pathname;if(Vr.test(r))return`/login`;let i=t??window.location.search,a=n??window.location.hash,o=`${F&&(r===F||r.startsWith(F+`/`))?r.slice(F.length)||`/`:r}${i}${a}`;return!o||o===`/`?`/login`:`/login?${Br}=${encodeURIComponent(o)}`}var Ur=()=>`${F}/api/user/verify/resend`,Wr=()=>`${F}/api/plugins`,Gr=e=>`${F}/api/mcp/${e}/reinitialize`,Kr=()=>`${F}/api/mcp/connection/status`,qr=e=>`${F}/api/mcp/connection/status/${e}`,Jr=e=>`${F}/api/mcp/${e}/auth-values`,Yr=e=>`${F}/api/mcp/oauth/cancel/${e}`,Xr=e=>`${F}/api/mcp/${e}/oauth/bind`,Zr=e=>`${F}/api/actions/${e}/oauth/bind`,Qr=e=>`${F}/api/config${Nn({context:e})}`,R=()=>`${F}/api/prompts`,$r=e=>`${F}/api/prompts/groups/${e}/prompts`,z=({path:e=``,options:t,version:n,endpoint:r,isAvatar:i})=>{let a=i===!0?`${oi()}/assistants`:`${F}/api/assistants/v${n}`;if(e&&e!==``&&(a+=`/${e}`),r&&(t={...t??{},endpoint:r}),t&&Object.keys(t).length>0){let e=new URLSearchParams(t).toString();a+=`?${e}`}return a},B=({path:e=``,options:t})=>{let n=`${F}/api/agents`;if(e&&e!==``&&(n+=`/${e}`),t&&Object.keys(t).length>0){let e=new URLSearchParams(t).toString();n+=`?${e}`}return n},ei=()=>`${F}/api/agents/chat/active`,ti={tools:`${F}/api/mcp/tools`,servers:`${F}/api/mcp/servers`},ni=e=>`${F}/api/mcp/servers/${e}`,ri=e=>`${B({path:`${e}/revert`})}`,V=()=>`${F}/api/files`,ii=e=>`${F}/api/files/${encodeURIComponent(e)}/preview`,ai=e=>`${F}/api/files/agent/${e}`,oi=()=>`${V()}/images`,si=()=>`${oi()}/avatar`,ci=()=>`${V()}/speech`,li=()=>`${ci()}/stt`,ui=()=>`${ci()}/tts`,di=()=>`${ui()}/manual`,fi=()=>`${ui()}/voices`,pi=()=>`${ci()}/config/get`,mi=e=>`${R()}/groups/${e}`,hi=e=>{let t=`${R()}/groups`,n=Object.entries(e).reduce((e,[t,n])=>(n!=null&&n!==``&&(e[t]=n),e),{});if(Object.keys(n).length>0){let e=new URLSearchParams(n).toString();t+=`?${e}`}return t},gi=e=>{let t=R();if(Object.keys(e).length>0){let n=new URLSearchParams(e).toString();t+=`?${n}`}return t},_i=e=>`${R()}/${e}`,vi=(e,t)=>`${R()}/random?limit=${e}&skip=${t}`,yi=R,bi=mi,xi=e=>`${R()}/groups/${e}/use`,Si=e=>`${_i(e)}/labels`,Ci=e=>`${_i(e)}/tags/production`,wi=mi,Ti=({_id:e,groupId:t})=>`${R()}/${e}?groupId=${t}`,Ei=()=>`${F}/api/categories`,Di=()=>`${R()}/all`,Oi=()=>`${F}/api/skills`,ki=()=>`${Oi()}/import`,Ai=e=>`${Oi()}/${encodeURIComponent(e)}`,ji=e=>{let t=Object.entries(e).reduce((e,[t,n])=>(n!=null&&n!==``&&(e[t]=String(n)),e),{}),n=Object.keys(t).length>0?`?${new URLSearchParams(t).toString()}`:``;return`${Oi()}${n}`},Mi=e=>`${Ai(e)}/files`,Ni=(e,t)=>`${Mi(e)}/${encodeURIComponent(t)}`,Pi=()=>`${F}/api/admin/skills/sync`,Fi=()=>`${Pi()}/status`,Ii=()=>`${Pi()}/run`,Li=e=>`${Pi()}/credentials/${encodeURIComponent(e)}`,Ri=()=>`${F}/api/user/settings/skills/active`,zi=()=>`${F}/api/roles`,Bi=()=>`${F}/api/admin/roles`,H=e=>`${zi()}/${encodeURIComponent(e)}`,Vi=e=>`${H(e)}/prompts`,Hi=e=>`${H(e)}/memories`,Ui=e=>`${H(e)}/agents`,Wi=e=>`${H(e)}/people-picker`,Gi=e=>`${H(e)}/mcp-servers`,Ki=e=>`${H(e)}/remote-agents`,qi=e=>`${H(e)}/marketplace`,Ji=e=>`${H(e)}/skills`,Yi=e=>`${F}/api/tags${e!=null&&e?`/${encodeURIComponent(e)}`:``}`,Xi=e=>`${Yi()}/convo/${e}`,Zi=()=>`${F}/api/user/terms`,Qi=()=>`${F}/api/user/terms/accept`,$i=()=>`${F}/api/banner`,ea=(e,t)=>`${F}/api/messages/${e}/${t}/feedback`,ta=()=>`${F}/api/auth/2fa/enable`,na=()=>`${F}/api/auth/2fa/verify`,ra=()=>`${F}/api/auth/2fa/confirm`,ia=()=>`${F}/api/auth/2fa/disable`,aa=()=>`${F}/api/auth/2fa/backup/regenerate`,oa=()=>`${F}/api/auth/2fa/verify-temp`,sa=()=>`${F}/api/memories`,ca=e=>`${sa()}/${encodeURIComponent(e)}`,la=()=>`${sa()}/preferences`,ua=e=>{let{q:t,limit:n,types:r}=e,i=`${F}/api/permissions/search-principals?q=${encodeURIComponent(t)}`;return n!==void 0&&(i+=`&limit=${n}`),r&&r.length>0&&(i+=`&types=${r.join(`,`)}`),i},da=e=>`${F}/api/permissions/${e}/roles`,fa=(e,t)=>`${F}/api/permissions/${e}/${t}`,pa=(e,t)=>`${F}/api/permissions/${e}/${t}`,ma=(e,t)=>`${F}/api/permissions/${e}/${t}/effective`,ha=e=>`${F}/api/permissions/${e}/effective/all`,ga=e=>`${F}/api/auth/graph-token?scopes=${encodeURIComponent(e)}`,_a=function(e){return e.local=`local`,e.firebase=`firebase`,e.azure=`azure`,e.azure_blob=`azure_blob`,e.openai=`openai`,e.s3=`s3`,e.cloudfront=`cloudfront`,e.vectordb=`vectordb`,e.execute_code=`execute_code`,e.mistral_ocr=`mistral_ocr`,e.azure_mistral_ocr=`azure_mistral_ocr`,e.vertexai_mistral_ocr=`vertexai_mistral_ocr`,e.text=`text`,e.document_parser=`document_parser`,e}({}),va=e=>e===`openai`||e===`azure`,ya=function(e){return e.avatar=`avatar`,e.unknown=`unknown`,e.agents=`agents`,e.assistants=`assistants`,e.execute_code=`execute_code`,e.image_generation=`image_generation`,e.assistants_output=`assistants_output`,e.message_attachment=`message_attachment`,e.skill_file=`skill_file`,e.filename=`filename`,e.updatedAt=`updatedAt`,e.source=`source`,e.filterSource=`filterSource`,e.context=`context`,e.bytes=`bytes`,e}({}),ba=function(e){return e.ServiceHttp=`service_http`,e.OAuth=`oauth`,e.None=`none`,e}({}),xa=function(e){return e.Bearer=`bearer`,e.Basic=`basic`,e.Custom=`custom`,e}({}),Sa=function(e){return e.DefaultPost=`default_post`,e.BasicAuthHeader=`basic_auth_header`,e}({}),Ca=(e,t)=>{e.client_secret&&!e.client_id&&t.addIssue({code:l.custom,path:[`client_secret`],message:`OAuth client_secret requires client_id`}),e.client_id&&e.client_secret&&(!e.authorization_url||!e.token_url)&&t.addIssue({code:l.custom,path:[`client_secret`],message:`OAuth client_secret with client_id requires both authorization_url and token_url`})},wa=_({authorization_url:p().transform(e=>C(e)).pipe(p().url()).optional(),token_url:p().transform(e=>C(e)).pipe(p().url()).optional(),client_id:p().optional(),client_secret:p().optional(),scope:p().optional(),redirect_uri:p().transform(e=>C(e)).pipe(p().url()).optional(),token_exchange_method:b(Sa).optional(),grant_types_supported:h(p()).optional(),token_endpoint_auth_methods_supported:h(p()).optional(),response_types_supported:h(p()).optional(),code_challenge_methods_supported:h(p()).optional(),skip_code_challenge_check:c().optional(),audience:p().min(1).optional(),forward_audience_on_refresh:c().optional(),revocation_endpoint:p().transform(e=>C(e)).pipe(p().url()).optional(),revocation_endpoint_auth_methods_supported:h(p()).optional()}),Ta=wa.superRefine(Ca),Ea=[`audience`,`resource`],Da=/\$\{[^}]+\}/,Oa=p().refine(e=>!Da.test(e),{message:`Environment variable references are not allowed in URLs`}).pipe(p().url()).refine(e=>{try{let{searchParams:t}=new URL(e);return Ea.every(e=>!t.has(e))}catch{return!0}},{message:`OAuth endpoint URLs cannot include audience or resource query parameters`}),ka=wa.omit({audience:!0,forward_audience_on_refresh:!0}).extend({authorization_url:Oa.optional(),token_url:Oa.optional(),redirect_uri:Oa.optional(),revocation_endpoint:Oa.optional(),audience:d().optional(),forward_audience_on_refresh:d().optional()}).superRefine(Ca),Aa=_({scopes:p().min(1)}),ja=_({title:p().regex(/^[a-zA-Z0-9 ]+$/,`Title can only contain letters, numbers, and spaces`).optional(),description:p().optional(),startup:c().optional(),iconPath:p().optional(),timeout:v().int().nonnegative().optional(),sseReadTimeout:v().int().positive().optional(),initTimeout:v().int().nonnegative().optional(),chatMenu:c().optional(),serverInstructions:x([c(),p()]).optional(),requiresOAuth:c().optional(),oauth:Ta.optional(),oauth_headers:m(p(),p()).optional(),apiKey:_({key:p().optional(),source:y([`admin`,`user`]),authorization_type:y([`basic`,`bearer`,`custom`]),custom_header:p().optional()}).optional(),customUserVars:m(p(),_({title:p(),description:p(),sensitive:c().optional()})).optional()}),Ma=p().transform(e=>C(e)).pipe(p().url()).refine(e=>{let t=new URL(e).protocol;return t===`http:`||t===`https:`||t===`socks:`||t===`socks5:`},{message:`Proxy URL must use http://, https://, socks://, or socks5://`}),Na=ja.extend({type:g(`stdio`).default(`stdio`),obo:s().optional(),command:p(),args:h(p()),env:m(p(),p()).optional().transform(e=>{if(!e)return e;let t={};for(let[n,r]of Object.entries(e))t[n]=C(r);return t}),stderr:x([y([`pipe`,`ignore`,`inherit`]),v().int().nonnegative()]).optional()}),Pa=ja.extend({type:g(`websocket`).default(`websocket`),obo:s().optional(),url:p().transform(e=>C(e)).pipe(p().url()).refine(e=>{let t=new URL(e).protocol;return t===`ws:`||t===`wss:`},{message:`WebSocket URL must start with ws:// or wss://`})}),Fa=ja.extend({type:g(`sse`).default(`sse`),headers:m(p(),p()).optional(),obo:Aa.optional(),proxy:Ma.optional(),url:p().transform(e=>C(e)).pipe(p().url()).refine(e=>{let t=new URL(e).protocol;return t!==`ws:`&&t!==`wss:`},{message:`SSE URL must not start with ws:// or wss://`})}),Ia=ja.extend({type:x([g(`streamable-http`),g(`http`)]),headers:m(p(),p()).optional(),obo:Aa.optional(),proxy:Ma.optional(),url:p().transform(e=>C(e)).pipe(p().url()).refine(e=>{let t=new URL(e).protocol;return t!==`ws:`&&t!==`wss:`},{message:`Streamable HTTP URL must not start with ws:// or wss://`})}),La=x([Na,Pa,Fa,Ia]),Ra=m(p(),La),za=e=>e.omit({startup:!0,timeout:!0,sseReadTimeout:!0,initTimeout:!0,chatMenu:!0,serverInstructions:!0,requiresOAuth:!0,customUserVars:!0,oauth_headers:!0}),Ba=e=>za(e).extend({oauth:ka.optional()}),Va=e=>/^wss?:/i.test(e),Ha=e=>/^https?:/i.test(e),Ua=(e,t)=>p().refine(e=>!Da.test(e),{message:`Environment variable references are not allowed in URLs`}).pipe(p().url()).refine(e,{message:t}),Wa=x([Ba(Pa).extend({url:Ua(Va,`WebSocket URL must use ws:// or wss://`)}),Ba(Fa).extend({proxy:d().optional(),url:Ua(Ha,`SSE URL must use http:// or https://`)}),Ba(Ia).extend({proxy:d().optional(),url:Ua(Ha,`Streamable HTTP URL must use http:// or https://`)})]);(()=>{let e=new Set;for(let t of Wa.options){let n=t.shape;for(let t of Object.keys(n))e.add(t)}return e})();var Ga=[`google`,`facebook`,`openid`,`github`,`discord`,`saml`],Ka=[`gpt-4o`,`o1-preview-2024-09-12`,`o1-preview`,`o1-mini-2024-09-12`,`o1-mini`,`o3-mini`,`chatgpt-4o-latest`,`gpt-4o-2024-05-13`,`gpt-4o-2024-08-06`,`gpt-4o-mini`,`gpt-4o-mini-2024-07-18`,`gpt-4-turbo-preview`,`gpt-3.5-turbo-0125`,`gpt-4-0125-preview`,`gpt-4-1106-preview`,`gpt-3.5-turbo-1106`,`gpt-3.5-turbo-0125`,`gpt-4-turbo`,`gpt-4-0125`,`gpt-4-1106`],qa=new Set([`conversationId`,`title`,`iconURL`,`greeting`,`endpoint`,`endpointType`,`createdAt`,`updatedAt`,`expiredAt`,`isTemporary`,`messages`,`isArchived`,`tags`,`user`,`__v`,`_id`,`tools`,`model`,`files`,`spec`,`disableParams`,`chatProjectId`]),Ja=function(e){return e.default=`default`,e.advanced=`advanced`,e}({});b(_a);function Ya(e){let t=e.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);if(!t)return!1;let[n,r,i]=t.slice(1).map(Number);return n===0||n===10||n===127||n===169&&r===254||n===172&&r>=16&&r<=31||n===192&&r===168||n===192&&r===0&&i===0||n===100&&r>=64&&r<=127||n===198&&(r===18||r===19)||n>=224}function Xa(e){if(!e.includes(`:`))return!1;if(e===`::1`||e===`::`||e.startsWith(`fc`)||e.startsWith(`fd`))return!0;let t=e.split(`:`,1)[0];if(/^[0-9a-f]{1,4}$/.test(t??``)&&(parseInt(t,16)&65472)==65152)return!0;let n=e.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);return n?Ya(n[1]):!1}function Za(e){if(typeof e!=`string`&&typeof e!=`number`)return``;let t=String(e).trim();if(!/^\d+$/.test(t))return``;let n=Number(t);return!Number.isInteger(n)||n<1||n>65535?``:String(n)}function Qa(e){let t=e.toLowerCase().trim(),n=t.match(/^\[([^\]]+)\]:(\d+)$/),r=n?null:t.match(/^([^:]+):(\d+)$/),i=(n?.[1]??r?.[1]??``).replace(/^\[|\]$/g,``),a=Za(n?.[2]??r?.[2]??``);return!i||!a?null:{address:i,port:a}}var $a=h(p().refine(e=>e.length>0&&e.trim().length>0,{message:`allowedAddresses entries must be non-empty`}).refine(e=>!e.includes(`://`)&&!e.includes(`/`)&&!/\s/.test(e),{message:`allowedAddresses entries must be host:port pairs — no URLs, paths, CIDR ranges, or whitespace`}).refine(e=>Qa(e)!=null,{message:`allowedAddresses entries must include a port, for example localhost:11434 or [::1]:11434`}).refine(e=>{let t=Qa(e);if(!t)return!1;let n=t.address,r=/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(n),i=!r&&n.includes(`:`);return!r&&!i?!0:r?Ya(n):Xa(n)},{message:`allowedAddresses is scoped to private IP space — public IP literals are not permitted (use hostname:port if it resolves to a private IP)`})).optional(),eo=y([`local`,`firebase`,`s3`,`azure_blob`,`cloudfront`]),to=_({default:eo.optional(),avatar:eo.optional(),image:eo.optional(),document:eo.optional(),skills:eo.optional()}).optional(),no=y([`none`,`cookies`,`url`]),ro=_({domain:p().url(),distributionId:p().optional(),invalidateOnDelete:c().default(!1),imageSigning:no.default(`none`),urlExpiry:v().positive().default(3600),cookieExpiry:v().positive().max(604800).default(1800),cookieDomain:p().min(1).refine(e=>e.startsWith(`.`),{message:`cookieDomain must start with a dot (e.g., ".example.com") to apply to subdomains`}).optional(),storageRegion:p().min(1).optional(),includeRegionInPath:c().default(!1),requireSignedAccess:c().default(!1)}).refine(e=>!e.invalidateOnDelete||!!e.distributionId,{message:`distributionId is required when invalidateOnDelete is true`,path:[`distributionId`]}).refine(e=>e.imageSigning!==`cookies`||!!e.cookieDomain,{message:`cookieDomain is required when imageSigning is "cookies" (e.g., ".example.com" for API at api.example.com and CDN at cdn.example.com)`,path:[`cookieDomain`]}).refine(e=>!e.requireSignedAccess||e.imageSigning===`cookies`,{message:`cloudfront.requireSignedAccess=true requires cloudfront.imageSigning="cookies" (signed URL mode is not yet implemented)`,path:[`requireSignedAccess`]}).optional(),io=p().min(1).max(64).regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,{message:`must start with a letter or digit and contain only letters, digits, underscores, or hyphens`}),ao=35791,oo=p().min(1).max(39).regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/,{message:`must be a valid GitHub owner name`}),so=p().min(1).max(100).regex(/^[a-zA-Z0-9._-]+$/,{message:`must be a valid GitHub repository name`}),co=new Set([`~`,`^`,`:`,`?`,`*`,`[`]);function lo(e){for(let t of e){let e=t.charCodeAt(0);if(e<=32||e===127||co.has(t))return!0}return!1}var uo=p().min(1).max(255).refine(e=>!e.startsWith(`/`)&&!e.endsWith(`/`),{message:`must not start or end with a slash`}).refine(e=>!e.includes(`..`)&&!e.includes(`//`)&&!e.includes(`\\`),{message:`must not contain traversal segments, empty path segments, or backslashes`}).refine(e=>!e.includes(`@{`)&&e!==`@`,{message:`must not contain invalid Git ref syntax`}).refine(e=>!e.endsWith(`.`),{message:`must not end with a dot`}).refine(e=>!lo(e),{message:`must not contain invalid Git ref characters`}).refine(e=>e.split(`/`).every(e=>e&&!e.startsWith(`.`)&&!e.endsWith(`.lock`)),{message:`must contain valid Git ref path segments`}),fo=p().max(500).refine(e=>e.trim().length>0,{message:`must not be empty`}).transform(e=>{let t=e.trim().replace(/^\/+|\/+$/g,``);return t===`.`?``:t}).refine(e=>!e.includes(`\\`)&&!e.includes(`..`),{message:`must not contain traversal segments or backslashes`}).refine(e=>e===``||/^[a-zA-Z0-9._\-/]+$/.test(e),{message:`must contain only letters, digits, dots, underscores, hyphens, and slashes`}).refine(e=>e===``||e.split(`/`).every(e=>e.length>0&&e!==`.`),{message:`must not contain empty or dot path segments`}),po=p().trim().regex(/^\$\{[A-Za-z_][A-Za-z0-9_]*\}$/,{message:"must be an environment variable reference like ${GITHUB_SKILLS_TOKEN}"}),mo=p().max(128).refine(e=>/^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/.test(e),{message:`must be a valid tenant id`}).refine(e=>e!==`__SYSTEM__`,{message:`must not be the reserved system tenant id`}),ho=_({id:io,owner:oo,repo:so,ref:uo.default(`main`),paths:h(fo).min(1),skillDiscoveryDepth:v().int().min(0).max(10).optional(),credentialKey:io.optional(),token:po.optional(),tenantId:mo.optional()}).superRefine((e,t)=>{!e.credentialKey&&!e.token&&t.addIssue({code:l.custom,path:[`credentialKey`],message:`Either credentialKey or token is required`}),e.credentialKey&&e.token&&t.addIssue({code:l.custom,path:[`token`],message:`Use either credentialKey or token, not both`})}),go=_({github:_({enabled:c().default(!1),intervalMinutes:v().int().min(5).max(ao).default(60),runOnStartup:c().default(!1),sources:h(ho).default([])}).superRefine((e,t)=>{e.enabled&&e.sources.length===0&&t.addIssue({code:l.custom,path:[`sources`],message:`At least one GitHub source is required when skill sync is enabled`});let n=new Set;for(let r of e.sources)n.has(r.id)&&t.addIssue({code:l.custom,path:[`sources`],message:`Duplicate GitHub skill sync source id "${r.id}"`}),n.add(r.id)}).optional()}).optional();function _o(e){let t=e.shape,n=Object.entries(t).map(([e,t])=>t instanceof ee?[e,t._def.defaultValue()]:[e,void 0]);return Object.fromEntries(n)}var vo=_({deploymentName:p().optional(),version:p().optional(),assistants:c().optional()}).or(c()),yo=u(()=>x([p(),v(),c(),f(),h(yo),m(p(),yo)])),bo=m(p(),yo).superRefine((e,t)=>{e.web_search===void 0||typeof e.web_search==`boolean`||t.addIssue({code:l.custom,path:[`web_search`],message:"`web_search` must be a boolean in addParams"})}),xo=_({apiKey:p(),serverless:c().optional(),instanceName:p().optional(),deploymentName:p().optional(),assistants:c().optional(),addParams:bo.optional(),dropParams:h(p()).optional(),version:p().optional(),baseURL:p().optional(),additionalHeaders:m(p()).optional()}),So=h(_({group:p(),models:m(p(),vo)}).required().and(xo)).min(1),Co=function(e){return e.code_interpreter=`code_interpreter`,e.image_vision=`image_vision`,e.retrieval=`retrieval`,e.actions=`actions`,e.tools=`tools`,e}({}),wo=function(e){return e.hide_sequential_outputs=`hide_sequential_outputs`,e.programmatic_tools=`programmatic_tools`,e.end_after_tools=`end_after_tools`,e.deferred_tools=`deferred_tools`,e.execute_code=`execute_code`,e.file_search=`file_search`,e.web_search=`web_search`,e.artifacts=`artifacts`,e.subagents=`subagents`,e.actions=`actions`,e.context=`context`,e.skills=`skills`,e.tools=`tools`,e.chain=`chain`,e.ocr=`ocr`,e}({}),To={assistants:2,azureAssistants:1},U=_({streamRate:v().optional(),baseURL:p().optional(),headers:m(p()).optional(),titlePrompt:p().optional(),titleModel:p().optional(),titleConvo:c().optional(),titleMethod:x([g(`completion`),g(`functions`),g(`structured`)]).optional(),titleEndpoint:p().optional(),titlePromptTemplate:p().optional(),titleTiming:x([g(`immediate`),g(`final`)]).optional(),maxToolResultChars:v().positive().optional()}),Eo=_({guardrailIdentifier:p(),guardrailVersion:p(),trace:y([`enabled`,`disabled`,`enabled_full`]).optional(),streamProcessingMode:y([`sync`,`async`]).optional()}),Do=U.merge(_({availableRegions:h(p()).optional(),models:h(p()).optional(),guardrailConfig:Eo.optional(),inferenceProfiles:m(p(),p()).optional()})),Oo=x([p(),_({name:p(),description:p().optional()})]),ko=U.merge(_({disableBuilder:c().optional(),pollIntervalMs:v().optional(),timeoutMs:v().optional(),version:x([p(),v()]).default(2),supportedIds:h(p()).min(1).optional(),excludedIds:h(p()).min(1).optional(),privateAssistants:c().optional(),retrievalModels:h(p()).min(1).optional().default(Ka),capabilities:h(b(Co)).optional().default([`code_interpreter`,`image_vision`,`retrieval`,`actions`,`tools`]),apiKey:p().optional(),models:_({default:h(Oo).min(1),fetch:c().optional(),userIdQuery:c().optional()}).optional(),headers:m(p()).optional()})),Ao=[`deferred_tools`,`execute_code`,`file_search`,`web_search`,`artifacts`,`subagents`,`actions`,`context`,`skills`,`tools`,`chain`,`ocr`],jo=new Set([`localhost`,`127.0.0.1`,`[::1]`]);function Mo(e){try{let t=new URL(e);if(t.protocol===`https:`)return!0;if(t.protocol!==`http:`)return!1;let n=t.hostname.toLowerCase();return jo.has(n)||n.endsWith(`.localhost`)}catch{return!1}}var No=p().url().refine(Mo,{message:`must use https:// unless targeting localhost`}),Po=p().refine(e=>!e.includes(`,`),{message:`scopes must be space-separated`}),Fo=_({enabled:c().default(!1),issuer:No.optional(),audience:p().min(1).optional(),jwksUri:No.optional(),scope:Po.optional()}).superRefine((e,t)=>{e.enabled===!0&&!e.issuer&&t.addIssue({code:l.custom,path:[`issuer`],message:`issuer is required when OIDC auth is enabled`}),e.enabled===!0&&!e.audience&&t.addIssue({code:l.custom,path:[`audience`],message:`audience is required when OIDC auth is enabled`})}),Io=_({auth:_({apiKey:_({enabled:c().default(!0)}).optional(),oidc:Fo.optional()}).optional()}),Lo=U.omit({baseURL:!0}).merge(_({recursionLimit:v().optional(),disableBuilder:c().optional().default(!1),maxRecursionLimit:v().optional(),maxCitations:v().min(1).max(50).optional().default(30),maxCitationsPerFile:v().min(1).max(10).optional().default(7),minRelevanceScore:v().min(0).max(1).optional().default(.45),allowedProviders:h(x([p(),D])).optional(),capabilities:h(b(wo)).optional().default(Ao),skills:_({maxCatalogSkills:v().int().min(1).max(100).optional()}).optional(),remoteApi:Io.optional()})).default({disableBuilder:!1,capabilities:Ao,maxCitations:30,maxCitationsPerFile:7,minRelevanceScore:.45}),Ro=_({key:p(),description:p().optional(),type:b(Gt).optional(),default:x([v(),c(),p(),h(p())]).optional(),showLabel:c().optional(),showDefault:c().optional(),options:h(p()).optional(),range:_({min:v(),max:v(),step:v().optional()}).optional(),enumMappings:m(x([v(),c(),p()])).optional(),component:b(Wt).optional(),optionType:b(Kt).optional(),columnSpan:v().int().nonnegative().optional(),columns:v().int().min(1).max(4).optional(),label:p().optional(),placeholder:p().optional(),labelCode:c().optional(),placeholderCode:c().optional(),descriptionCode:c().optional(),minText:v().optional(),maxText:v().optional(),minTags:v().min(0).optional(),maxTags:v().min(0).optional(),includeInput:c().optional(),descriptionSide:y([`top`,`right`,`bottom`,`left`]).optional(),searchPlaceholder:p().optional(),selectPlaceholder:p().optional(),searchPlaceholderCode:c().optional(),selectPlaceholderCode:c().optional()}),zo=U.merge(_({name:p().refine(e=>!D.safeParse(e).success,{message:`Value cannot be one of the default endpoint (EModelEndpoint) values: ${Object.values(Ae).join(`, `)}`}),apiKey:p(),baseURL:p(),models:_({default:h(Oo).min(1),fetch:c().optional(),userIdQuery:c().optional()}),iconURL:p().optional(),modelDisplayLabel:p().optional(),provider:g(`anthropic`).optional(),headers:m(p()).optional(),addParams:bo.optional(),dropParams:h(p()).optional(),customParams:_({defaultParamsEndpoint:p().default(`custom`),reasoningFormat:tt.optional(),reasoningKey:nt.optional(),includeReasoningContent:c().optional(),includeReasoningHistory:c().optional(),paramDefinitions:h(Ro).optional()}).strict().optional(),directEndpoint:c().optional(),titleMessageRole:y([`system`,`user`,`assistant`]).optional(),tokenConfig:m(_({prompt:v(),completion:v(),context:v(),cacheRead:v().optional(),cacheWrite:v().optional()})).optional()})),Bo=_({groups:So,assistants:c().optional()}).and(zo.pick({streamRate:!0,titleConvo:!0,titleMethod:!0,titleModel:!0,titlePrompt:!0,titleTiming:!0,titlePromptTemplate:!0}).partial()),Vo=_({deploymentName:p().optional()}).or(c()),Ho=_({enabled:c().optional(),projectId:p().optional(),region:p().default(`us-east5`),serviceKeyFile:p().optional(),deploymentName:p().optional(),models:x([h(p()),m(p(),Vo)]).optional()}),Uo=U.merge(_({vertex:Ho.optional(),models:h(p()).optional()})),Wo=_({url:p().optional(),apiKey:p(),model:p(),voices:h(p())}),Go=_({instanceName:p(),apiKey:p(),deploymentName:p(),apiVersion:p(),model:p(),voices:h(p())}),Ko=_({url:p().optional(),websocketUrl:p().optional(),apiKey:p(),model:p(),voices:h(p()),voice_settings:_({similarity_boost:v().optional(),stability:v().optional(),style:v().optional(),use_speaker_boost:c().optional()}).optional(),pronunciation_dictionary_locators:h(p()).optional()}),qo=_({url:p(),apiKey:p().optional(),voices:h(p()),backend:p()}),Jo=_({openai:Wo.optional(),azureOpenAI:Go.optional(),elevenlabs:Ko.optional(),localai:qo.optional()}),Yo=_({url:p().optional(),apiKey:p(),model:p()}),Xo=_({instanceName:p(),apiKey:p(),deploymentName:p(),apiVersion:p()}),Zo=_({openai:Yo.optional(),azureOpenAI:Xo.optional()}),Qo=_({conversationMode:c().optional(),advancedMode:c().optional(),speechToText:c().optional().or(_({engineSTT:y([`openai`,`azureOpenAI`]).optional(),languageSTT:p().optional(),autoTranscribeAudio:c().optional(),decibelValue:v().optional(),autoSendText:v().optional()})).optional(),textToSpeech:c().optional().or(_({engineTTS:y([`openai`,`azureOpenAI`,`elevenlabs`,`localai`]).optional(),voice:p().optional(),languageTTS:p().optional(),automaticPlayback:c().optional(),playbackRate:v().min(.25).max(4).optional(),cacheTTS:c().optional()})).optional()}).optional(),$o=_({fileUploads:_({ipMax:v().optional(),ipWindowInMinutes:v().optional(),userMax:v().optional(),userWindowInMinutes:v().optional()}).optional(),conversationsImport:_({ipMax:v().optional(),ipWindowInMinutes:v().optional(),userMax:v().optional(),userWindowInMinutes:v().optional()}).optional(),tts:_({ipMax:v().optional(),ipWindowInMinutes:v().optional(),userMax:v().optional(),userWindowInMinutes:v().optional()}).optional(),stt:_({ipMax:v().optional(),ipWindowInMinutes:v().optional(),userMax:v().optional(),userWindowInMinutes:v().optional()}).optional()}),es=function(e){return e.PNG=`png`,e.WEBP=`webp`,e.JPEG=`jpeg`,e}({}),ts=_({externalUrl:p().optional(),openNewTab:c().optional(),modalAcceptance:c().optional(),modalTitle:p().optional(),modalContent:p().or(h(p())).optional()}),ns=x([p(),m(p())]),rs=_({placeholder:p().optional(),use:c().optional(),create:c().optional(),share:c().optional(),public:c().optional(),configureObo:c().optional(),trustCheckbox:_({label:ns.optional(),subLabel:ns.optional()}).optional()}).optional(),is=function(e){return e.ALL=`all`,e.TEMPORARY=`temporary`,e}({}),as=_({privacyPolicy:_({externalUrl:p().optional(),openNewTab:c().optional()}).optional(),termsOfService:ts.optional(),customWelcome:p().optional(),mcpServers:rs.optional(),modelSelect:c().optional(),parameters:c().optional(),multiConvo:c().optional(),bookmarks:c().optional(),memories:c().optional(),presets:c().optional(),prompts:x([c(),_({use:c().optional(),create:c().optional(),share:c().optional(),public:c().optional()})]).optional(),agents:x([c(),_({use:c().optional(),create:c().optional(),share:c().optional(),public:c().optional()})]).optional(),temporaryChat:c().optional(),temporaryChatRetention:v().min(1).max(8760).optional(),autoSubmitFromUrl:c().optional(),retentionMode:b(is).default(`temporary`),retainAgentFiles:c().optional(),runCode:c().optional(),webSearch:c().optional(),contextUsage:c().optional(),contextCost:c().optional(),currency:_({code:p(),rate:v().positive()}).optional(),peoplePicker:_({users:c().optional(),groups:c().optional(),roles:c().optional()}).optional(),marketplace:_({use:c().optional()}).optional(),fileSearch:c().optional(),fileCitations:c().optional(),defaultPinnedTools:h(p()).optional(),buildInfo:c().optional(),remoteAgents:_({use:c().optional(),create:c().optional(),share:c().optional(),public:c().optional()}).optional(),skills:x([c(),_({use:c().optional(),create:c().optional(),share:c().optional(),public:c().optional(),defaultActiveOnShare:c().optional()})]).optional(),sharedLinks:x([c(),_({create:c().optional(),share:c().optional(),public:c().optional(),snapshotFiles:c().optional()})]).optional()}).default({modelSelect:!0,parameters:!0,presets:!0,multiConvo:!0,bookmarks:!0,memories:!0,prompts:{use:!0,create:!0,share:!1,public:!1},agents:{use:!0,create:!0,share:!1,public:!1},temporaryChat:!0,autoSubmitFromUrl:!0,runCode:!0,webSearch:!0,contextUsage:!0,contextCost:!1,peoplePicker:{users:!0,groups:!0,roles:!0},marketplace:{use:!1},mcpServers:{use:!0,create:!0,share:!1,public:!1},fileSearch:!0,fileCitations:!0,buildInfo:!0,remoteAgents:{use:!1,create:!1,share:!1,public:!1},skills:{use:!0,create:!0,share:!1,public:!1,defaultActiveOnShare:!1},sharedLinks:{create:!0,share:!0,public:!0,snapshotFiles:!0}}),os=_({language:p().default(`auto`),size:y([`normal`,`compact`,`flexible`,`invisible`]).default(`normal`)}).default({language:`auto`,size:`normal`}),ss=_({siteKey:p(),options:os.optional()}),cs=function(e){return e.MISTRAL_OCR=`mistral_ocr`,e.CUSTOM_OCR=`custom_ocr`,e.AZURE_MISTRAL_OCR=`azure_mistral_ocr`,e.VERTEXAI_MISTRAL_OCR=`vertexai_mistral_ocr`,e.DOCUMENT_PARSER=`document_parser`,e}({}),ls=function(e){return e.PROVIDERS=`providers`,e.SCRAPERS=`scrapers`,e.RERANKERS=`rerankers`,e}({}),us=function(e){return e.SERPER=`serper`,e.SEARXNG=`searxng`,e.TAVILY=`tavily`,e}({}),ds=function(e){return e.FIRECRAWL=`firecrawl`,e.SERPER=`serper`,e.TAVILY=`tavily`,e}({}),fs=function(e){return e.JINA=`jina`,e.COHERE=`cohere`,e.NONE=`none`,e}({}),ps=function(e){return e[e.OFF=0]=`OFF`,e[e.MODERATE=1]=`MODERATE`,e[e.STRICT=2]=`STRICT`,e}({}),ms=_({serperApiKey:p().optional().default("${SERPER_API_KEY}"),searxngInstanceUrl:p().optional().default("${SEARXNG_INSTANCE_URL}"),searxngApiKey:p().optional().default("${SEARXNG_API_KEY}"),firecrawlApiKey:p().optional().default("${FIRECRAWL_API_KEY}"),firecrawlApiUrl:p().optional().default("${FIRECRAWL_API_URL}"),firecrawlVersion:p().optional().default("${FIRECRAWL_VERSION}"),tavilyApiKey:p().optional().default("${TAVILY_API_KEY}"),tavilySearchUrl:p().optional().default("${TAVILY_SEARCH_URL}"),tavilyExtractUrl:p().optional().default("${TAVILY_EXTRACT_URL}"),jinaApiKey:p().optional().default("${JINA_API_KEY}"),jinaApiUrl:p().optional().default("${JINA_API_URL}"),cohereApiKey:p().optional().default("${COHERE_API_KEY}"),searchProvider:b(us).optional(),scraperProvider:b(ds).optional(),rerankerType:b(fs).optional(),scraperTimeout:v().int().nonnegative().optional(),safeSearch:b(ps).default(1),firecrawlOptions:_({formats:h(p()).optional(),includeTags:h(p()).optional(),excludeTags:h(p()).optional(),headers:m(p()).optional(),waitFor:v().optional(),timeout:v().int().nonnegative().optional(),maxAge:v().optional(),mobile:c().optional(),skipTlsVerification:c().optional(),blockAds:c().optional(),removeBase64Images:c().optional(),parsePDF:c().optional(),storeInCache:c().optional(),zeroDataRetention:c().optional(),location:_({country:p().optional(),languages:h(p()).optional()}).optional(),onlyMainContent:c().optional(),changeTrackingOptions:_({modes:h(p()).optional(),schema:m(S()).optional(),prompt:p().optional(),tag:p().nullable().optional()}).optional()}).optional(),tavilySearchOptions:_({searchDepth:y([`basic`,`advanced`,`fast`,`ultra-fast`]).optional(),maxResults:v().int().min(1).max(20).optional(),includeImages:c().optional(),includeAnswer:x([c(),y([`basic`,`advanced`])]).optional(),includeRawContent:x([c(),y([`markdown`,`text`])]).optional(),includeDomains:h(p()).optional(),excludeDomains:h(p()).optional(),topic:y([`general`,`news`,`finance`]).optional(),timeRange:y([`day`,`week`,`month`,`year`,`d`,`w`,`m`,`y`]).optional(),includeImageDescriptions:c().optional(),includeFavicon:c().optional(),chunksPerSource:v().int().min(1).max(3).optional(),safeSearch:c().optional(),timeout:v().int().nonnegative().max(12e4).optional()}).optional(),tavilyScraperOptions:_({extractDepth:y([`basic`,`advanced`]).optional(),includeImages:c().optional(),includeFavicon:c().optional(),format:y([`markdown`,`text`]).optional(),timeout:v().int().nonnegative().max(12e4).optional()}).optional()}),hs=_({mistralModel:p().optional(),apiKey:p().optional().default("${OCR_API_KEY}"),baseURL:p().optional().default("${OCR_BASEURL}"),strategy:b(cs).default(`mistral_ocr`)}),gs=_({enabled:c().optional().default(!1),startBalance:v().optional().default(2e4),autoRefillEnabled:c().optional().default(!1),refillIntervalValue:v().optional().default(30),refillIntervalUnit:y(Xt).optional().default(`days`),refillAmount:v().optional().default(1e4)}),_s=_({enabled:c().optional().default(!0)}),vs=12e3,ys=_({disabled:c().optional(),validKeys:h(p()).optional(),tokenLimit:v().optional(),charLimit:v().optional().default(1e4),maxInputTokens:v().int().positive().optional().default(vs),personalize:c().default(!0),messageWindowSize:v().optional().default(5),agent:x([_({enabled:c().optional(),id:p()}),_({enabled:c().optional(),provider:p(),model:p(),instructions:p().optional(),model_parameters:m(x([p(),v(),c()])).optional()})]).optional()}),bs=te(`type`,[_({type:g(`token_ratio`),value:v().finite().min(0).max(1)}),_({type:g(`remaining_tokens`),value:v().finite().int().positive()}),_({type:g(`messages_to_refine`),value:v().finite().int().positive()})]),xs=_({enabled:c().optional(),keepLastAssistants:v().min(0).max(10).optional(),softTrimRatio:v().min(0).max(1).optional(),hardClearRatio:v().min(0).max(1).optional(),minPrunableToolChars:v().min(0).optional()}),Ss=_({enabled:c().optional(),provider:p().optional(),model:p().optional(),parameters:m(x([p(),v(),c(),f()])).optional(),trigger:bs.optional(),prompt:p().optional(),updatePrompt:p().optional(),reserveRatio:v().min(0).max(1).optional(),maxSummaryTokens:v().positive().optional(),contextPruning:xs.optional()}),Cs=h(zo.partial()).optional(),ws=_({id:p().min(1),label:p().min(1),regex:p().min(1).refine(e=>{try{return new RegExp(e,`g`),!0}catch{return!1}},{message:`Invalid regex`})}),Ts=_({pii:_({starterPatterns:h(p()).optional(),customPatterns:h(ws).optional()}).optional()}),Es=_({version:p(),cache:c().default(!0),ocr:hs.optional(),webSearch:ms.optional(),memory:ys.optional(),summarization:Ss.optional(),skillSync:go,secureImageLinks:c().optional(),imageOutputType:b(es).default(`png`),includedTools:h(p()).optional(),filteredTools:h(p()).optional(),mcpServers:Ra.optional(),mcpSettings:_({allowedDomains:h(p()).optional(),allowedAddresses:$a}).optional(),interface:as,turnstile:ss.optional(),fileStrategy:eo.default(`local`),fileStrategies:to,cloudfront:ro,actions:_({allowedDomains:h(p()).optional(),allowedAddresses:$a}).optional(),registration:_({socialLogins:h(p()).optional(),allowedDomains:h(p()).optional()}).default({socialLogins:Ga}),balance:gs.optional(),transactions:_s.optional(),speech:_({tts:Jo.optional(),stt:Zo.optional(),speechTab:Qo.optional()}).optional(),rateLimits:$o.optional(),fileConfig:On.optional(),modelSpecs:Yt.optional(),messageFilter:Ts.optional(),endpoints:_({allowedAddresses:$a,all:U.omit({baseURL:!0}).optional(),openAI:U.optional(),google:U.optional(),anthropic:Uo.optional(),azureOpenAI:Bo.optional(),azureAssistants:ko.optional(),assistants:ko.optional(),agents:Lo.optional(),custom:Cs.optional(),bedrock:Do.optional()}).strict().refine(e=>Object.keys(e).length>0,{message:"At least one `endpoints` field must be provided."}).optional()}),Ds=()=>_o(Es),Os=function(e){return e.anyscale=`anyscale`,e.apipie=`apipie`,e.cohere=`cohere`,e.fireworks=`fireworks`,e.deepseek=`deepseek`,e.moonshot=`moonshot`,e.groq=`groq`,e.helicone=`helicone`,e.huggingface=`huggingface`,e.mistral=`mistral`,e.mlx=`mlx`,e.ollama=`ollama`,e.openrouter=`openrouter`,e.perplexity=`perplexity`,e.shuttleai=`shuttleai`,e[`together.ai`]=`together.ai`,e.unify=`unify`,e.vercel=`vercel`,e.xai=`xai`,e}({}),ks=[`openAI`,`assistants`,`azureAssistants`,`azureOpenAI`,`agents`,`google`,`anthropic`,`custom`,`bedrock`],As={openAI:`OpenAI`,assistants:`Assistants`,agents:`My Agents`,azureAssistants:`Azure Assistants`,azureOpenAI:`Azure OpenAI`,google:`Google`,anthropic:`Anthropic`,custom:`Custom`,bedrock:`AWS Bedrock`,ollama:`Ollama`,deepseek:`DeepSeek`,moonshot:`Moonshot`,xai:`xAI`,vercel:`Vercel`,helicone:`Helicone`},js=[`gpt-5.5`,`gpt-5.5-pro`,`chat-latest`,`gpt-5.4`,`gpt-5.4-pro`,`gpt-5.4-mini`,`gpt-5.4-nano`,`gpt-5.3-codex`,`gpt-5.2`,`gpt-5.1`,`gpt-5.1-codex`,`gpt-5.1-codex-max`,`gpt-5.1-codex-mini`,`gpt-5`,`gpt-5-mini`,`gpt-5-nano`,`gpt-4.1`,`gpt-4.1-mini`,`gpt-4.1-nano`,`gpt-4o-mini`,`gpt-4o`],Ms=[`claude-fable-5`,`claude-opus-4-8`,`claude-opus-4-7`,`claude-sonnet-4-6`,`claude-opus-4-6`,`claude-sonnet-4-5`,`claude-sonnet-4-5-20250929`,`claude-haiku-4-5`,`claude-haiku-4-5-20251001`,`claude-opus-4-1`,`claude-opus-4-1-20250805`,`claude-opus-4-5`,`claude-sonnet-4-20250514`,`claude-sonnet-4-0`,`claude-opus-4-20250514`,`claude-opus-4-0`,`claude-3-7-sonnet-latest`,`claude-3-7-sonnet-20250219`,`claude-3-5-haiku-20241022`,`claude-3-5-sonnet-20241022`,`claude-3-5-sonnet-20240620`,`claude-3-5-sonnet-latest`],Ns=`anthropic.claude-fable-5,anthropic.claude-opus-4-8,anthropic.claude-opus-4-7,anthropic.claude-sonnet-4-6,anthropic.claude-opus-4-6-v1,anthropic.claude-sonnet-4-5-20250929-v1:0,anthropic.claude-haiku-4-5-20251001-v1:0,anthropic.claude-opus-4-1-20250805-v1:0,anthropic.claude-3-5-sonnet-20241022-v2:0,anthropic.claude-3-5-sonnet-20240620-v1:0,anthropic.claude-3-5-haiku-20241022-v1:0,cohere.command-r-v1:0,cohere.command-r-plus-v1:0,meta.llama2-13b-chat-v1,meta.llama2-70b-chat-v1,meta.llama3-8b-instruct-v1:0,meta.llama3-70b-instruct-v1:0,meta.llama3-1-8b-instruct-v1:0,meta.llama3-1-70b-instruct-v1:0,meta.llama3-1-405b-instruct-v1:0,mistral.mistral-7b-instruct-v0:2,mistral.mixtral-8x7b-instruct-v0:1,mistral.mistral-large-2402-v1:0,mistral.mistral-large-2407-v1:0,mistral.mistral-small-2402-v1:0,ai21.jamba-instruct-v1:0,amazon.titan-text-lite-v1,amazon.titan-text-express-v1,amazon.titan-text-premier-v1:0`.split(`,`),Ps={azureAssistants:js,assistants:[...js,`chatgpt-4o-latest`],agents:js,google:[`gemini-3.5-flash`,`gemini-3.1-pro-preview`,`gemini-3.1-pro-preview-customtools`,`gemini-3.1-flash-lite-preview`,`gemini-3-pro-preview`,`gemini-3-flash-preview`,`gemini-2.5-pro`,`gemini-2.5-flash`,`gemini-2.5-flash-lite`],anthropic:Ms,openAI:[...js,`chatgpt-4o-latest`,`gpt-4-vision-preview`,`gpt-3.5-turbo-instruct-0914`,`gpt-3.5-turbo-instruct`],bedrock:Ns},Fs=e=>/gpt-4|gpt-3\\.5/i.test(e)&&!/vision|instruct/i.test(e),Is=Ps.openAI,Ls={initial:[],openAI:Is,assistants:Is.filter(Fs),agents:Is,azureOpenAI:Is,google:Ps.google,anthropic:Ps.anthropic,bedrock:Ps.bedrock},Rs={assistants:`${I()}/api/assistants/v2/chat`,azureAssistants:`${I()}/api/assistants/v1/chat`,agents:`${I()}/api/agents/chat`},zs=new Set([`anthropic`,`google`,`openAI`,`azureOpenAI`,`custom`,`agents`,`bedrock`]),Bs=new Set([`dalle`,`dall-e`,`stable-diffusion`,`flux`,`gemini_image_gen`]),Vs=function(e){return e.PROMPT_GROUPS=`promptGroups`,e.SHARED_LINKS=`sharedLinks`,e}({}),Hs=function(e){return e[e.ONE_DAY=864e5]=`ONE_DAY`,e[e.TWELVE_HOURS=432e5]=`TWELVE_HOURS`,e[e.ONE_HOUR=36e5]=`ONE_HOUR`,e[e.THIRTY_MINUTES=18e5]=`THIRTY_MINUTES`,e[e.TEN_MINUTES=6e5]=`TEN_MINUTES`,e[e.FIVE_MINUTES=3e5]=`FIVE_MINUTES`,e[e.THREE_MINUTES=18e4]=`THREE_MINUTES`,e[e.TWO_MINUTES=12e4]=`TWO_MINUTES`,e[e.ONE_MINUTE=6e4]=`ONE_MINUTE`,e[e.THIRTY_SECONDS=3e4]=`THIRTY_SECONDS`,e}({}),Us=function(e){return e.FILE_UPLOAD_LIMIT=`file_upload_limit`,e.ILLEGAL_MODEL_REQUEST=`illegal_model_request`,e.TOKEN_BALANCE=`token_balance`,e.BAN=`ban`,e.TTS_LIMIT=`tts_limit`,e.STT_LIMIT=`stt_limit`,e.RESET_PASSWORD_LIMIT=`reset_password_limit`,e.VERIFY_EMAIL_LIMIT=`verify_email_limit`,e.CONVO_ACCESS=`convo_access`,e.TOOL_CALL_LIMIT=`tool_call_limit`,e.GENERAL=`general`,e.LOGINS=`logins`,e.CONCURRENT=`concurrent`,e.NON_BROWSER=`non_browser`,e.MESSAGE_LIMIT=`message_limit`,e.REGISTRATIONS=`registrations`,e}({}),Ws=function(e){return e.NO_USER_KEY=`no_user_key`,e.EXPIRED_USER_KEY=`expired_user_key`,e.INVALID_USER_KEY=`invalid_user_key`,e.NO_BASE_URL=`no_base_url`,e.INVALID_BASE_URL=`invalid_base_url`,e.MODERATION=`moderation`,e.INPUT_LENGTH=`INPUT_LENGTH`,e.INVALID_REQUEST=`invalid_request_error`,e.INVALID_ACTION=`invalid_action_error`,e.NO_SYSTEM_MESSAGES=`no_system_messages`,e.GOOGLE_ERROR=`google_error`,e.GOOGLE_TOOL_CONFLICT=`google_tool_conflict`,e.INVALID_AGENT_PROVIDER=`invalid_agent_provider`,e.MISSING_MODEL=`missing_model`,e.MODELS_NOT_LOADED=`models_not_loaded`,e.ENDPOINT_MODELS_NOT_LOADED=`endpoint_models_not_loaded`,e.AUTH_FAILED=`auth_failed`,e.REFUSAL=`refusal`,e.STREAM_EXPIRED=`stream_expired`,e}({}),Gs=function(e){return e.GOOGLE_SERVICE_KEY=`GOOGLE_SERVICE_KEY`,e.GOOGLE_API_KEY=`GOOGLE_API_KEY`,e.ANTHROPIC_API_KEY=`ANTHROPIC_API_KEY`,e}({}),Ks=function(e){return e.GENERAL=`general`,e.CHAT=`chat`,e.SPEECH=`speech`,e.BETA=`beta`,e.DATA=`data`,e.BALANCE=`balance`,e.ACCOUNT=`account`,e.COMMANDS=`commands`,e.PERSONALIZATION=`personalization`,e.ABOUT=`about`,e}({}),qs=function(e){return e.VERSION=`v0.8.7`,e.CONFIG_VERSION=`1.3.13`,e.NO_PARENT=`00000000-0000-0000-0000-000000000000`,e.USE_PRELIM_RESPONSE_MESSAGE_ID=`USE_PRELIM_RESPONSE_MESSAGE_ID`,e.NEW_CONVO=`new`,e.PENDING_CONVO=`PENDING`,e.SEARCH=`search`,e[e.ENCODED_DOMAIN_LENGTH=10]=`ENCODED_DOMAIN_LENGTH`,e.CURRENT_MODEL=`current_model`,e.COMMON_DIVIDER=`__`,e[e.COMMANDS_MAX_LENGTH=56]=`COMMANDS_MAX_LENGTH`,e[e.DEFAULT_STREAM_RATE=1]=`DEFAULT_STREAM_RATE`,e.SAVED_TAG=`Saved`,e[e.MAX_CONVO_STARTERS=4]=`MAX_CONVO_STARTERS`,e.mcp_delimiter=`_mcp_`,e.mcp_prefix=`mcp_`,e.mcp_all=`sys__all__sys`,e.mcp_clear=`sys__clear__sys`,e.spec_defaults_key=`__defaults__`,e.mcp_server=`sys__server__sys`,e.LC_TRANSFER_TO_=`lc_transfer_to_`,e.EPHEMERAL_AGENT_ID=`ephemeral`,e.PROGRAMMATIC_TOOL_CALLING=`run_tools_with_code`,e.BASH_PROGRAMMATIC_TOOL_CALLING=`run_tools_with_bash`,e.SUBAGENT=`subagent`,e}({}),Js=function(e){return e.APP_TITLE=`appTitle`,e.LAST_CONVO_SETUP=`lastConversationSetup`,e.LAST_MODEL=`lastSelectedModel`,e.LAST_TOOLS=`lastSelectedTools`,e.LAST_SPEC=`lastSelectedSpec`,e.FILES_TO_DELETE=`filesToDelete`,e.ASST_ID_PREFIX=`assistant_id__`,e.AGENT_ID_PREFIX=`agent_id__`,e.FORK_SETTING=`forkSetting`,e.REMEMBER_FORK_OPTION=`rememberDefaultFork`,e.FORK_SPLIT_AT_TARGET=`splitAtTarget`,e.TEXT_DRAFT=`textDraft_`,e.FILES_DRAFT=`filesDraft_`,e.LAST_PROMPT_CATEGORY=`lastPromptCategory`,e.ENABLE_USER_MSG_MARKDOWN=`enableUserMsgMarkdown`,e.AUTO_EXPAND_TOOLS=`autoExpandTools`,e.LAST_MCP_=`LAST_MCP_`,e.LAST_CODE_TOGGLE_=`LAST_CODE_TOGGLE_`,e.LAST_WEB_SEARCH_TOGGLE_=`LAST_WEB_SEARCH_TOGGLE_`,e.LAST_FILE_SEARCH_TOGGLE_=`LAST_FILE_SEARCH_TOGGLE_`,e.LAST_ARTIFACTS_TOGGLE_=`LAST_ARTIFACTS_TOGGLE_`,e.LAST_SKILLS_TOGGLE_=`LAST_SKILLS_TOGGLE_`,e.LAST_AGENT_PROVIDER=`lastAgentProvider`,e.LAST_AGENT_MODEL=`lastAgentModel`,e.PIN_MCP_=`PIN_MCP_`,e.PIN_WEB_SEARCH_=`PIN_WEB_SEARCH_`,e.PIN_CODE_INTERPRETER_=`PIN_CODE_INTERPRETER_`,e}({}),Ys=function(e){return e.DIRECT_PATH=`directPath`,e.INCLUDE_BRANCHES=`includeBranches`,e.TARGET_LEVEL=`targetLevel`,e.DEFAULT=`default`,e}({}),Xs=function(e){return e.ALL=`sys__all__sys`,e.MY_PROMPTS=`sys__my__prompts__sys`,e.NO_CATEGORY=`sys__no__category__sys`,e.SHARED_PROMPTS=`sys__shared__prompts__sys`,e}({}),Zs={current_date:!0,current_user:!0,iso_datetime:!0,current_datetime:!0};function Qs(e,t,n){if(!e||t==null)return;let r=e[t];if(r)return r[n]}function $s(e,t,n){if(t)return Ve(t)?n?Qs(e,n,`type`)||n:`agents`:Qs(e,t,`type`)||t}function ec(e,t){if(!(!e||!t))return e[t]?.customParams?.defaultParamsEndpoint}var tc=function(e){return e.USER=`user`,e.GROUP=`group`,e.PUBLIC=`public`,e.ROLE=`role`,e}({}),nc=function(e){return e.AGENT=`agent`,e.PROMPTGROUP=`promptGroup`,e.MCPSERVER=`mcpServer`,e.REMOTE_AGENT=`remoteAgent`,e.SKILL=`skill`,e.SHARED_LINK=`sharedLink`,e}({}),rc=function(e){return e[e.VIEW=1]=`VIEW`,e[e.EDIT=2]=`EDIT`,e[e.DELETE=4]=`DELETE`,e[e.SHARE=8]=`SHARE`,e}({}),ic=function(e){return e.AGENT_VIEWER=`agent_viewer`,e.AGENT_EDITOR=`agent_editor`,e.AGENT_OWNER=`agent_owner`,e.PROMPTGROUP_VIEWER=`promptGroup_viewer`,e.PROMPTGROUP_EDITOR=`promptGroup_editor`,e.PROMPTGROUP_OWNER=`promptGroup_owner`,e.MCPSERVER_VIEWER=`mcpServer_viewer`,e.MCPSERVER_EDITOR=`mcpServer_editor`,e.MCPSERVER_OWNER=`mcpServer_owner`,e.REMOTE_AGENT_VIEWER=`remoteAgent_viewer`,e.REMOTE_AGENT_EDITOR=`remoteAgent_editor`,e.REMOTE_AGENT_OWNER=`remoteAgent_owner`,e.SKILL_VIEWER=`skill_viewer`,e.SKILL_EDITOR=`skill_editor`,e.SKILL_OWNER=`skill_owner`,e.SHARED_LINK_VIEWER=`sharedLink_viewer`,e.SHARED_LINK_OWNER=`sharedLink_owner`,e}({}),ac=_({type:b(tc),id:p().optional(),name:p().optional(),email:p().optional(),source:y([`local`,`entra`]).optional(),avatar:p().optional(),description:p().optional(),idOnTheSource:p().optional(),accessRoleId:b(ic).optional(),memberCount:v().optional()}),oc=_({accessRoleId:b(ic),name:p(),description:p().optional(),resourceType:b(nc).default(`agent`),permBits:v()}),sc=_({id:p(),principalType:b(tc),principalId:p().optional(),principalName:p().optional(),role:oc,grantedBy:p(),grantedAt:p(),inheritedFrom:p().optional(),source:y([`local`,`entra`]).optional()});_({resourceType:b(nc),resourceId:p(),permissions:h(sc)}),_({updated:ac.array(),removed:ac.array(),public:c().optional(),publicAccessRoleId:p().optional()}),_({message:p(),results:_({principals:ac.array(),public:c().optional(),publicAccessRoleId:p().optional()})}),_({resourceType:b(nc),resourceId:b(ic),principals:h(ac),public:c(),publicAccessRoleId:b(ic).optional()}),_({permissionBits:v()});function cc(e,t){return(e&t)===t}var lc=function(e){return e.messages=`messages`,e.sharedMessages=`sharedMessages`,e.sharedStartupConfig=`sharedStartupConfig`,e.sharedLinks=`sharedLinks`,e.allConversations=`allConversations`,e.archivedConversations=`archivedConversations`,e.searchConversations=`searchConversations`,e.conversation=`conversation`,e.searchEnabled=`searchEnabled`,e.user=`user`,e.name=`name`,e.models=`models`,e.balance=`balance`,e.endpoints=`endpoints`,e.tokenConfig=`tokenConfig`,e.contextProjection=`contextProjection`,e.presets=`presets`,e.searchResults=`searchResults`,e.tokenCount=`tokenCount`,e.availablePlugins=`availablePlugins`,e.startupConfig=`startupConfig`,e.assistants=`assistants`,e.assistant=`assistant`,e.agents=`agents`,e.agent=`agent`,e.files=`files`,e.fileConfig=`fileConfig`,e.tools=`tools`,e.toolAuth=`toolAuth`,e.toolCalls=`toolCalls`,e.mcpTools=`mcpTools`,e.mcpConnectionStatus=`mcpConnectionStatus`,e.mcpAuthValues=`mcpAuthValues`,e.agentTools=`agentTools`,e.actions=`actions`,e.assistantDocs=`assistantDocs`,e.agentDocs=`agentDocs`,e.fileDownload=`fileDownload`,e.filePreview=`filePreview`,e.voices=`voices`,e.customConfigSpeech=`customConfigSpeech`,e.prompts=`prompts`,e.prompt=`prompt`,e.promptGroups=`promptGroups`,e.allPromptGroups=`allPromptGroups`,e.promptGroup=`promptGroup`,e.projects=`projects`,e.project=`project`,e.projectConversations=`projectConversations`,e.categories=`categories`,e.randomPrompts=`randomPrompts`,e.agentCategories=`agentCategories`,e.marketplaceAgents=`marketplaceAgents`,e.roles=`roles`,e.rolesList=`rolesList`,e.conversationTags=`conversationTags`,e.health=`health`,e.userTerms=`userTerms`,e.banner=`banner`,e.memories=`memories`,e.principalSearch=`principalSearch`,e.accessRoles=`accessRoles`,e.resourcePermissions=`resourcePermissions`,e.effectivePermissions=`effectivePermissions`,e.graphToken=`graphToken`,e.mcpServers=`mcpServers`,e.mcpServer=`mcpServer`,e.activeJobs=`activeJobs`,e.agentApiKeys=`agentApiKeys`,e.skills=`skills`,e.skill=`skill`,e.skillFiles=`skillFiles`,e.skillFileContent=`skillFileContent`,e.skillTree=`skillTree`,e.skillNodeContent=`skillNodeContent`,e.skillFavorites=`skillFavorites`,e.skillStates=`skillStates`,e.favorites=`favorites`,e}({}),uc={agentFiles:e=>[`agentFiles`,e]},dc=function(e){return e.createAgentApiKey=`createAgentApiKey`,e.deleteAgentApiKey=`deleteAgentApiKey`,e.fileUpload=`fileUpload`,e.fileDelete=`fileDelete`,e.updatePreset=`updatePreset`,e.deletePreset=`deletePreset`,e.loginUser=`loginUser`,e.logoutUser=`logoutUser`,e.refreshToken=`refreshToken`,e.avatarUpload=`avatarUpload`,e.speechToText=`speechToText`,e.textToSpeech=`textToSpeech`,e.assistantAvatarUpload=`assistantAvatarUpload`,e.agentAvatarUpload=`agentAvatarUpload`,e.updateAction=`updateAction`,e.updateAgentAction=`updateAgentAction`,e.deleteAction=`deleteAction`,e.deleteAgentAction=`deleteAgentAction`,e.revertAgentVersion=`revertAgentVersion`,e.deleteUser=`deleteUser`,e.updateRole=`updateRole`,e.enableTwoFactor=`enableTwoFactor`,e.verifyTwoFactor=`verifyTwoFactor`,e.updateMemoryPreferences=`updateMemoryPreferences`,e.createProject=`createProject`,e.updateProject=`updateProject`,e.deleteProject=`deleteProject`,e.assignConversationToProject=`assignConversationToProject`,e.createSkillNode=`createSkillNode`,e.updateSkillNode=`updateSkillNode`,e.deleteSkillNode=`deleteSkillNode`,e.updateSkillNodeContent=`updateSkillNodeContent`,e.convoPin=`convoPin`,e}({});function fc(e){e===void 0?delete r.defaults.headers.common.Authorization:r.defaults.headers.common.Authorization=`Bearer `+e}function pc(){let e=r.defaults.headers.common.Authorization;return typeof e==`string`?e:void 0}async function mc(e,t){return(await r.get(e,{...t})).data}async function hc(e,t){return await r.get(e,{...t})}async function gc(e,t){return(await r.post(e,JSON.stringify(t),{headers:{"Content-Type":`application/json`}})).data}async function _c(e,t,n){return(await r.post(e,t,{...n,headers:{"Content-Type":`multipart/form-data`}})).data}async function vc(e,t,n){return(await r.post(e,t,{...n,headers:{"Content-Type":`multipart/form-data`},responseType:`arraybuffer`})).data}async function yc(e,t){return(await r.put(e,JSON.stringify(t),{headers:{"Content-Type":`application/json`}})).data}async function bc(e){return(await r.delete(e)).data}async function xc(e,t){return(await r.delete(e,{...t})).data}async function Sc(e,t){return(await r.patch(e,JSON.stringify(t),{headers:{"Content-Type":`application/json`}})).data}var Cc=`authRecovery`,wc=`authRedirectStarted`,Tc=`librechat.auth.redirect.startedAt`,Ec=15e3,Dc=120*1e3,Oc=e=>gc(Pr(e)),kc=/^\/share\/[^/]+\/?$/,Ac=/^\/api\/share\/[^/]+$/,jc=e=>e.startsWith(`/`)?e:`/${e}`,Mc=e=>{let t=jc(e),n=I();if(!n)return t;let r=jc(n);return t===r||t.startsWith(`${r}/`)?t.slice(r.length)||`/`:t},Nc=()=>kc.test(Mc(window.location.pathname)),Pc=e=>{if(typeof e!=`string`)return``;try{return new URL(e,window.location.origin).pathname}catch{return e.split(/[?#]/)[0]??``}},Fc=(e,t)=>t?.toLowerCase()===`get`&&Ac.test(Mc(Pc(e))),Ic=e=>{fc(e),zc(),window.dispatchEvent(new CustomEvent(`tokenUpdated`,{detail:e}))},W=()=>{let e=window;return e.__librechatAuthRecovery??={lastRedirectStartedAt:0,refreshPromise:null},e.__librechatAuthRecovery},Lc=()=>{let e=W();try{let t=window.localStorage.getItem(Tc),n=t==null?0:Number(t);return Math.max(Number.isFinite(n)?n:0,e.lastRedirectStartedAt)}catch{return e.lastRedirectStartedAt}},Rc=()=>{let e=W();e.lastRedirectStartedAt=Date.now();try{window.localStorage.setItem(Tc,String(e.lastRedirectStartedAt))}catch{}},zc=()=>{let e=W();e.lastRedirectStartedAt=0;try{window.localStorage.removeItem(Tc)}catch{}},Bc=()=>{let e=Lc();return Number.isFinite(e)&&e>0&&Date.now()-e<Ec},Vc=e=>{window.dispatchEvent(new CustomEvent(Cc,{detail:{state:e}}))},Hc=(e,t)=>{let n=e.headers??{};n.Authorization=`Bearer ${t}`,e.headers=n},Uc=e=>e?.includes(`/api/auth/2fa`)===!0||e?.includes(`/api/auth/logout`)===!0||e?.includes(`/api/auth/refresh`)===!0,Wc=e=>{let t=W();return t.refreshPromise?t.refreshPromise:(Vc(`started`),t.refreshPromise=Oc(e).then(e=>{let t=e?.token??``;return t?(Ic(t),t):null}).finally(()=>{t.refreshPromise=null,Vc(`finished`)}),t.refreshPromise)},Gc=()=>{if(Bc())return;let e=I()+Hr();Rc(),window.dispatchEvent(new CustomEvent(wc,{detail:{href:e}})),window.location.href=e},Kc=()=>{let e=r.defaults.headers.common.Authorization;return typeof e!=`string`||!e.startsWith(`Bearer `)?null:e.slice(7)},qc=e=>{let t=e.split(`.`)[1];if(!t)return null;try{let e=t.replace(/-/g,`+`).replace(/_/g,`/`),n=e.padEnd(e.length+(4-e.length%4)%4,`=`),r=JSON.parse(window.atob(n));return typeof r.exp==`number`?r.exp*1e3:null}catch{return null}},Jc=e=>{if(Uc(e)||Bc())return!1;let t=Kc();if(!t)return!1;let n=qc(t);if(n==null)return!1;let r=n-Date.now();return r>0&&r<=Dc};typeof window<`u`&&(r.interceptors.request.use(async e=>{let t=W();if(t.refreshPromise&&!Uc(e.url)){let n=await t.refreshPromise.catch(()=>null);return n&&Hc(e,n),e}if(!Jc(e.url))return e;let n=await Wc(!1).catch(()=>null);return n&&Hc(e,n),e}),r.interceptors.response.use(e=>e,async e=>{let t=e.config;if(!e.response||!t)return Promise.reject(e);let n=t.url?.includes(`/api/auth/refresh`)===!0;if(Uc(t.url)&&!n||n&&W().refreshPromise||!r.defaults.headers.common.Authorization&&!(Nc()&&Fc(t.url,t.method))||Bc())return Promise.reject(e);if(e.response.status===401&&!t._retry){W().refreshPromise??console.warn(`401 error, refreshing token`),t._retry=!0;try{let i=await Wc(n);return i?(Hc(t,i),await r(t)):(Gc(),Promise.reject(e))}catch(e){return Promise.reject(e)}}return Promise.reject(e)}));var G={get:mc,getResponse:hc,post:gc,postMultiPart:_c,postTTS:vc,put:yc,delete:bc,deleteWithOptions:xc,patch:Sc,refreshToken:Oc,dispatchTokenUpdatedEvent:Ic},Yc=ue({acceptTerms:()=>mf,addPromptToGroup:()=>bd,addTagToConversation:()=>uf,archiveConversation:()=>$u,assignConversationToProject:()=>ad,bindActionOAuth:()=>Ll,bindMCPOAuth:()=>Il,branchMessage:()=>fd,callTool:()=>nu,cancelMCPOAuth:()=>Vl,clearAllConversations:()=>Ju,confirmTwoFactor:()=>yf,createAgent:()=>mu,createAgentApiKey:()=>ml,createAssistant:()=>ql,createConversationTag:()=>sf,createMCPServer:()=>ku,createMemory:()=>Df,createPreset:()=>_l,createProject:()=>td,createPrompt:()=>yd,createSharedLink:()=>ll,createSkill:()=>jd,createSkillNode:()=>Bd,deleteAction:()=>pu,deleteAgent:()=>yu,deleteAgentAction:()=>Eu,deleteAgentApiKey:()=>hl,deleteAssistant:()=>Xl,deleteConversation:()=>qu,deleteConversationTag:()=>lf,deleteFiles:()=>Bu,deleteGitHubSkillSyncCredential:()=>Jd,deleteMCPServer:()=>ju,deleteMemory:()=>wf,deletePreset:()=>yl,deleteProject:()=>id,deletePrompt:()=>Cd,deletePromptGroup:()=>Ed,deleteSharedLink:()=>dl,deleteSkill:()=>Nd,deleteSkillFile:()=>Rd,deleteSkillNode:()=>Hd,deleteUser:()=>Qc,disableTwoFactor:()=>bf,duplicateAgent:()=>vu,duplicateConversation:()=>Gu,editArtifact:()=>dd,enableTwoFactor:()=>_f,forkConversation:()=>Ku,genTitle:()=>sd,getAIEndpoints:()=>Ul,getAccessRoles:()=>kf,getActions:()=>fu,getActiveJobs:()=>If,getAgentApiKeys:()=>pl,getAgentById:()=>hu,getAgentCategories:()=>Su,getAgentFiles:()=>su,getAllEffectivePermissions:()=>Nf,getAllPromptGroups:()=>gd,getAssistantById:()=>Jl,getAssistantDocs:()=>Ql,getAvailableAgentTools:()=>wu,getAvailablePlugins:()=>Nl,getAvailableTools:()=>$l,getBanner:()=>hf,getCategories:()=>Dd,getCodeOutputDownload:()=>zu,getContextProjection:()=>Gl,getConversationById:()=>Zu,getConversationTags:()=>of,getConversations:()=>Xu,getCustomConfigSpeech:()=>Wu,getDomainServerBaseUrl:()=>Ff,getEffectivePermissions:()=>Mf,getExpandedAgentById:()=>gu,getFavorites:()=>$c,getFileConfig:()=>cu,getFileDownload:()=>Iu,getFileDownloadURL:()=>Lu,getFilePreview:()=>au,getFiles:()=>iu,getGitHubSkillSyncStatus:()=>Gd,getGraphApiToken:()=>Pf,getLoginGoogle:()=>Ol,getMCPAuthValues:()=>Bl,getMCPConnectionStatus:()=>Rl,getMCPServer:()=>Ou,getMCPServerConnectionStatus:()=>zl,getMCPServers:()=>Du,getMCPTools:()=>eu,getMarketplaceAgents:()=>Cu,getMemories:()=>Cf,getMessagesByConvoId:()=>pd,getModels:()=>Kl,getPresets:()=>gl,getProjectById:()=>nd,getPrompt:()=>md,getPromptGroup:()=>vd,getPromptGroups:()=>_d,getPrompts:()=>hd,getRandomPrompts:()=>Od,getResourcePermissions:()=>Af,getRole:()=>Xd,getSearchEnabled:()=>bl,getSharedFileDownload:()=>Ru,getSharedFilePreview:()=>ou,getSharedLink:()=>cl,getSharedMessages:()=>al,getSharedStartupConfig:()=>ol,getSkill:()=>Ad,getSkillFavorites:()=>tl,getSkillFileContent:()=>Ld,getSkillNodeContent:()=>Ud,getSkillStates:()=>rl,getSkillTree:()=>zd,getStartupConfig:()=>Hl,getTokenConfig:()=>Wl,getToolCalls:()=>ru,getUser:()=>xl,getUserBalance:()=>Sl,getUserTerms:()=>pf,getVerifyAgentToolAuth:()=>tu,getVoices:()=>Uu,healthCheck:()=>ff,importConversationsFile:()=>Mu,importSkill:()=>Id,listAgents:()=>bu,listAssistants:()=>Zl,listConversations:()=>Yu,listMessages:()=>cd,listProjects:()=>ed,listRoles:()=>Yd,listSharedLinks:()=>sl,listSkillFiles:()=>Pd,listSkills:()=>kd,login:()=>wl,logout:()=>Tl,makePromptProduction:()=>wd,pinConversation:()=>od,rebuildConversationTags:()=>df,recordPromptGroupUsage:()=>Sd,regenerateBackupCodes:()=>xf,register:()=>El,reinitializeMCPServer:()=>Fl,requestPasswordReset:()=>kl,resendVerificationEmail:()=>Ml,resetPassword:()=>Al,revertAgentVersion:()=>xu,revokeAllUserKeys:()=>Zc,revokeUserKey:()=>Xc,runGitHubSkillSync:()=>Kd,searchPrincipals:()=>Of,setGitHubSkillSyncCredential:()=>qd,speechToText:()=>Vu,textToSpeech:()=>Hu,updateAction:()=>du,updateAgent:()=>_u,updateAgentAction:()=>Tu,updateAgentPermissions:()=>Qd,updateAssistant:()=>Yl,updateConversation:()=>Qu,updateConversationTag:()=>cf,updateFavorites:()=>el,updateFeedback:()=>gf,updateMCPServer:()=>Au,updateMCPServersPermissions:()=>tf,updateMarketplacePermissions:()=>rf,updateMemory:()=>Tf,updateMemoryPermissions:()=>$d,updateMemoryPreferences:()=>Ef,updateMessage:()=>ld,updateMessageContent:()=>ud,updatePeoplePickerPermissions:()=>ef,updatePreset:()=>vl,updateProject:()=>rd,updatePromptGroup:()=>xd,updatePromptLabels:()=>Td,updatePromptPermissions:()=>Zd,updateRemoteAgentsPermissions:()=>nf,updateResourcePermissions:()=>jf,updateSharedLink:()=>ul,updateSkill:()=>Md,updateSkillFavorites:()=>nl,updateSkillNode:()=>Vd,updateSkillNodeContent:()=>Wd,updateSkillPermissions:()=>af,updateSkillStates:()=>il,updateTokenCount:()=>Cl,updateUserKey:()=>fl,updateUserPlugins:()=>Pl,uploadAgentAvatar:()=>Fu,uploadAssistantAvatar:()=>Pu,uploadAvatar:()=>Nu,uploadFile:()=>uu,uploadImage:()=>lu,uploadSkillFile:()=>Fd,userKeyQuery:()=>Dl,verifyEmail:()=>jl,verifyTwoFactor:()=>vf,verifyTwoFactorTemp:()=>Sf});function Xc(e){return G.delete(nr(e))}function Zc(){return G.delete(rr())}function Qc(e){return G.deleteWithOptions(Rn(),{data:e})}function $c(){return G.get(`${I()}/api/user/settings/favorites`)}function el(e){return G.post(`${I()}/api/user/settings/favorites`,{favorites:e})}function tl(){return Promise.resolve([])}function nl(e){return Promise.resolve(e)}function rl(){return G.get(Ri())}function il(e){return G.post(Ri(),{skillStates:e})}function al(e){return G.get(Wn(e))}function ol(e){return G.get(Gn(e))}var sl=async e=>{let{pageSize:t,sortBy:n,sortDirection:r,search:i,cursor:a}=e;return G.get(qn(t,n,r,i,a))};function cl(e){return G.get(Kn(e))}function ll(e,t,n){return G.post(Jn(e),{targetMessageId:t,snapshotFiles:n})}function ul(e,t,n){return G.patch(Yn(e),{targetMessageId:t,snapshotFiles:n})}function dl(e){return G.delete(Wn(e))}function fl(e){let{value:t}=e;if(!t)throw Error(`value is required`);return G.put(er(),e)}function pl(){return G.get(ar())}function ml(e){return G.post(ar(),e)}function hl(e){return G.delete(or(e))}function gl(){return G.get(Cr())}function _l(e){return G.post(Cr(),e)}function vl(e){return G.post(Cr(),e)}function yl(e){return G.post(wr(),e)}function bl(){return G.get(Sr())}function xl(){return G.get(Fn())}function Sl(){return G.get(In())}var Cl=e=>G.post(kr(),{arg:e}),wl=e=>G.post(Ar(),e),Tl=()=>G.post(jr()),El=e=>G.post(Mr(),e),Dl=e=>G.get(tr(e)),Ol=()=>G.get(Nr()),kl=e=>G.post(Fr(),e),Al=e=>G.post(Ir(),e),jl=e=>G.post(Lr(),e),Ml=e=>G.post(Ur(),e),Nl=()=>G.get(Wr()),Pl=e=>G.post(Ln(),e),Fl=e=>G.post(Gr(e)),Il=e=>G.post(Xr(e)),Ll=e=>G.post(Zr(e)),Rl=()=>G.get(Kr()),zl=e=>G.get(qr(e)),Bl=e=>G.get(Jr(e));function Vl(e){return G.post(Yr(e),{})}var Hl=e=>G.get(Qr(e?.context)),Ul=()=>G.get(Tr()),Wl=()=>G.get(Er()),Gl=e=>G.post(Dr(),e),Kl=async()=>G.get(Or()),ql=({version:e,...t})=>G.post(z({version:e}),t),Jl=({endpoint:e,assistant_id:t,version:n})=>G.get(z({path:t,endpoint:e,version:n})),Yl=({assistant_id:e,data:t,version:n})=>G.patch(z({path:e,version:n}),t),Xl=({assistant_id:e,model:t,endpoint:n,version:r})=>G.delete(z({path:e,options:{model:t,endpoint:n},version:r})),Zl=(e,t)=>G.get(z({version:t,options:e}));function Ql({endpoint:e,version:t}){return Be(e)?G.get(z({path:`documents`,version:t,options:{endpoint:e},endpoint:e})):Promise.resolve([])}var $l=(e,t)=>{let n=``;if(Be(e)){let r=e;n=z({path:`tools`,endpoint:r,version:t??To[r]})}else n=B({path:`tools`});return G.get(n)},eu=()=>G.get(ti.tools),tu=e=>G.get(B({path:`tools/${e.toolId}/auth`})),nu=({toolId:e,toolParams:t})=>G.post(B({path:`tools/${e}/call`}),t),ru=e=>G.get(B({path:`tools/calls`,options:e})),iu=()=>G.get(V()),au=e=>G.get(ii(e)),ou=(e,t)=>G.get(Qn(e,t)),su=e=>G.get(ai(e)),cu=()=>G.get(`${V()}/config`),lu=(e,t)=>{let n=t?{signal:t}:void 0;return G.postMultiPart(oi(),e,n)},uu=(e,t)=>{let n=t?{signal:t}:void 0;return G.postMultiPart(V(),e,n)},du=e=>{let{assistant_id:t,version:n,...r}=e;return G.post(z({path:`actions/${t}`,version:n}),r)};function fu(){return G.get(B({path:`actions`}))}var pu=async({assistant_id:e,action_id:t,model:n,version:r,endpoint:i})=>G.delete(z({path:`actions/${e}/${t}/${n}`,version:r,endpoint:i})),mu=({...e})=>G.post(B({}),e),hu=({agent_id:e})=>G.get(B({path:e})),gu=({agent_id:e})=>G.get(B({path:`${e}/expanded`})),_u=({agent_id:e,data:t})=>G.patch(B({path:e}),t),vu=({agent_id:e})=>G.post(B({path:`${e}/duplicate`})),yu=({agent_id:e})=>G.delete(B({path:e})),bu=e=>G.get(B({options:e})),xu=({agent_id:e,version_index:t})=>G.post(ri(e),{version_index:t}),Su=()=>G.get(B({path:`categories`})),Cu=e=>G.get(B({options:e})),wu=()=>G.get(B({path:`tools`})),Tu=e=>{let{agent_id:t,...n}=e;return G.post(B({path:`actions/${t}`}),n)},Eu=async({agent_id:e,action_id:t})=>G.delete(B({path:`actions/${e}/${t}`})),Du=async()=>G.get(ti.servers),Ou=async e=>G.get(ni(e)),ku=async e=>G.post(ti.servers,e),Au=async(e,t)=>G.patch(ni(e),t),ju=async e=>G.delete(ni(e)),Mu=e=>G.postMultiPart(hr(),e),Nu=e=>G.postMultiPart(si(),e),Pu=e=>G.postMultiPart(z({isAvatar:!0,path:`${e.assistant_id}/avatar`,options:{model:e.model,endpoint:e.endpoint},version:e.version}),e.formData),Fu=e=>G.postMultiPart(`${oi()}/agents/${e.agent_id}/avatar`,e.formData),Iu=async(e,t)=>G.getResponse(`${V()}/download/${e}/${t}`,{responseType:`blob`,headers:{Accept:`application/octet-stream`}}),Lu=async(e,t)=>G.get(`${V()}/download-url/${e}/${t}`),Ru=async(e,t)=>G.getResponse(Zn(e,t),{responseType:`blob`,headers:{Accept:`application/octet-stream`}}),zu=async e=>G.getResponse(e,{responseType:`blob`,headers:{Accept:`application/octet-stream`}}),Bu=async e=>G.deleteWithOptions(V(),{data:e}),Vu=e=>G.postMultiPart(li(),e),Hu=e=>G.postTTS(di(),e),Uu=()=>G.get(fi()),Wu=()=>G.get(pi());function Gu(e){return G.post(_r(),e)}function Ku(e){return G.post(gr(),e)}function qu(e){return G.deleteWithOptions(pr(),{data:{arg:e}})}function Ju(){return G.delete(mr())}var Yu=e=>G.get(sr(e??{}));function Xu(e){return G.get(sr({cursor:e}))}function Zu(e){return G.get(cr(e))}function Qu(e){return G.post(ur(),{arg:e})}function $u(e){return G.post(dr(),{arg:e})}function ed(e){return G.get(yr(e??{}))}function td(e){return G.post(yr(),e)}function nd(e){return G.get(br(e))}function rd(e){let{projectId:t,...n}=e;return G.patch(br(t),n)}function id(e){return G.delete(br(e))}function ad(e){let{conversationId:t,projectId:n}=e;return G.put(xr(t),{projectId:n})}function od(e){return G.post(fr(),{arg:e})}function sd(e){return G.get(lr(e.conversationId))}var cd=e=>G.get(Bn(e??{}));function ld(e){let{conversationId:t,messageId:n,text:r}=e;if(!t)throw Error(`conversationId is required`);return G.put(Bn({conversationId:t,messageId:n}),{text:r})}function ud(e){let{conversationId:t,messageId:n,index:r,text:i}=e;if(!t)throw Error(`conversationId is required`);return G.put(Bn({conversationId:t,messageId:n}),{text:i,index:r})}var dd=async({messageId:e,...t})=>G.post(Vn(e),t),fd=async e=>G.post(Hn(),e);function pd(e){return e===`new`||e===`PENDING`?Promise.resolve([]):G.get(Bn({conversationId:e}))}function md(e){return G.get(_i(e))}function hd(e){return G.get(gi(e))}function gd(){return G.get(Di())}function _d(e){return G.get(hi(e))}function vd(e){return G.get(mi(e))}function yd(e){return G.post(yi(),e)}function bd(e,t){return G.post($r(e),t)}function xd(e){return G.patch(bi(e.id),e.payload)}function Sd(e){return G.post(xi(e))}function Cd(e){return G.delete(Ti(e))}function wd(e){return G.patch(Ci(e))}function Td(e){return G.patch(Si(e.id),e.payload)}function Ed(e){return G.delete(wi(e))}function Dd(){return G.get(Ei())}function Od(e){return G.get(vi(e.limit,e.skip))}function kd(e){return G.get(ji(e??{}))}function Ad(e){return G.get(Ai(e))}function jd(e){return G.post(Oi(),e)}function Md(e){return G.patch(Ai(e.id),{expectedVersion:e.expectedVersion,...e.payload})}function Nd(e){return G.delete(Ai(e))}function Pd(e){return G.get(Mi(e))}function Fd(e,t){return G.postMultiPart(Mi(e),t)}function Id(e){return G.postMultiPart(ki(),e)}function Ld(e,t){return G.get(Ni(e,t))}function Rd(e,t){return G.delete(Ni(e,t))}var zd=e=>Promise.resolve({nodes:[]}),Bd=(e,t)=>{let n=t instanceof FormData?t.get(`name`)||`untitled`:t.name,r=t instanceof FormData?`file`:t.type,i=new Date().toISOString();return Promise.resolve({_id:`pending-${i}`,skillId:e,parentId:null,type:r,name:n,order:0,author:``,createdAt:i,updatedAt:i})},Vd=e=>{let t=new Date().toISOString();return Promise.resolve({_id:e.nodeId,skillId:e.skillId,parentId:e.data.parentId??null,type:`file`,name:e.data.name??``,order:e.data.order??0,author:``,createdAt:t,updatedAt:t})},Hd=e=>Promise.resolve(),Ud=e=>Promise.resolve({content:``,mimeType:`text/plain`}),Wd=e=>{let t=new Date().toISOString();return Promise.resolve({_id:e.nodeId,skillId:e.skillId,parentId:null,type:`file`,name:``,order:0,author:``,createdAt:t,updatedAt:t})};function Gd(){return G.get(Fi())}function Kd(){return G.post(Ii())}function qd(e){return G.put(Li(e.credentialKey),{token:e.token})}function Jd(e){return G.delete(Li(e))}function Yd(){return G.get(`${Bi()}?limit=200`)}function Xd(e){return G.get(H(e))}function Zd(e){return G.put(Vi(e.roleName),e.updates)}function Qd(e){return G.put(Ui(e.roleName),e.updates)}function $d(e){return G.put(Hi(e.roleName),e.updates)}function ef(e){return G.put(Wi(e.roleName),e.updates)}function tf(e){return G.put(Gi(e.roleName),e.updates)}function nf(e){return G.put(Ki(e.roleName),e.updates)}function rf(e){return G.put(qi(e.roleName),e.updates)}function af(e){return G.put(Ji(e.roleName),e.updates)}function of(){return G.get(Yi())}function sf(e){return G.post(Yi(),e)}function cf(e,t){return G.put(Yi(e),t)}function lf(e){return G.delete(Yi(e))}function uf(e,t){return G.put(Xi(e),t)}function df(){return G.post(Yi(`rebuild`))}function ff(){return G.get(Pn())}function pf(){return G.get(Zi())}function mf(){return G.post(Qi())}function hf(){return G.get($i())}function gf(e,t,n){return G.put(ea(e,t),n)}function _f(e){return G.post(ta(),e)}function vf(e){return G.post(na(),e)}function yf(e){return G.post(ra(),e)}function bf(e){return G.post(ia(),e)}function xf(e){return G.post(aa(),e)}function Sf(e){return G.post(oa(),e)}var Cf=()=>G.get(sa()),wf=e=>G.delete(ca(e)),Tf=(e,t,n)=>G.patch(ca(n||e),{key:e,value:t}),Ef=e=>G.patch(la(),e),Df=e=>G.post(sa(),e);function Of(e){return G.get(ua(e))}function kf(e){return G.get(da(e))}function Af(e,t){return G.get(fa(e,t))}function jf(e,t,n){return G.put(pa(e,t),n)}function Mf(e,t){return G.get(ma(e,t))}function Nf(e){return G.get(ha(e))}function Pf(e){return G.get(ga(e.scopes))}function Ff(){return`${I()}/api`}var If=()=>G.get(ei()),Lf=t({ActionRequest:()=>Qm,ArtifactModes:()=>kp,BEDROCK_FINE_GRAINED_TOOL_STREAMING_BETA:()=>Wf,BEDROCK_OUTPUT_128K_BETA:()=>Uf,BedrockReasoningConfig:()=>Ye,ContentTypes:()=>np,DEFAULT_MEMORY_MAX_INPUT_TOKENS:()=>vs,EndpointURLs:()=>Rs,FunctionSignature:()=>Ym,InvocationMode:()=>Hm,MAX_SUBAGENTS:()=>10,MAX_SUBAGENT_DEPTH:()=>5,MAX_SUBAGENT_GRAPH_NODES:()=>50,MAX_SUBAGENT_RUN_CONFIGS:()=>100,PERMISSION_TYPE_INTERFACE_FIELDS:()=>_m,PermissionTypes:()=>gm,Permissions:()=>vm,SKILL_BODY_MAX_LENGTH:()=>SKILL_BODY_MAX_LENGTH,SKILL_DESCRIPTION_MAX_LENGTH:()=>Um,SKILL_DESCRIPTION_SHORT_THRESHOLD:()=>20,SKILL_DISPLAY_TITLE_MAX_LENGTH:()=>128,SKILL_NAME_MAX_LENGTH:()=>64,SKILL_NAME_PATTERN:()=>Wm,SKILL_SYNC_DEFAULT_DISCOVERY_DEPTH:()=>2,SKILL_SYNC_MAX_DISCOVERY_DEPTH:()=>10,SKILL_SYNC_MAX_INTERVAL_MINUTES:()=>ao,SKILL_SYNC_MIN_INTERVAL_MINUTES:()=>5,StepEvents:()=>ap,StepTypes:()=>rp,SystemRoles:()=>Im,ToolCallTypes:()=>ip,UsageEvents:()=>op,accordian:()=>jp,actionDelimiter:()=>we,actionDomainSeparator:()=>`---`,agentParamSettings:()=>zh,agentPermissionsSchema:()=>Sm,alert:()=>Np,alertDialog:()=>Mp,alternateName:()=>As,anthropicSchema:()=>Ht,anthropicSettings:()=>E,apiBaseUrl:()=>I,appendAgentIdSuffix:()=>Dp,applyModelAwareDefaults:()=>Bh,assistantSchema:()=>Lt,avatar:()=>Pp,badge:()=>Fp,bedrockDocumentExtensions:()=>rn,bedrockInputSchema:()=>tp,bookmarkPermissionsSchema:()=>bm,breadcrumb:()=>Ip,buildTree:()=>Op,button:()=>Lp,calendar:()=>Rp,card:()=>zp,carousel:()=>Bp,checkbox:()=>Vp,collapsible:()=>Hp,compactAgentsSchema:()=>Ut,compactAssistantSchema:()=>Rt,compactGoogleSchema:()=>Vt,createPayload:()=>ih,createURL:()=>Km,dialog:()=>Up,drawer:()=>Wp,dropdownMenu:()=>Gp,encodeEphemeralAgentId:()=>Cp,fileCitationsPermissionsSchema:()=>Am,fileSearchPermissionsSchema:()=>km,getFirstDefinedValue:()=>fp,getNonEmptyValue:()=>pp,getResponseSender:()=>_p,googleSchema:()=>It,googleSettings:()=>T,hostImageIdSuffix:()=>hostImageIdSuffix,hostImageNamePrefix:()=>hostImageNamePrefix,hoverCard:()=>Kp,input:()=>qp,inputTokensIncludesCache:()=>Pe,isAssistantsEndpoint:()=>Be,isEphemeralAgentId:()=>Tp,isMythosClassModel:()=>St,isSystemRoleName:()=>Bm,label:()=>Jp,librechat:()=>J,marketplacePermissionsSchema:()=>Om,mcpServersPermissionsSchema:()=>jm,megabyte:()=>bn,memoryPermissionsSchema:()=>xm,menuBar:()=>Yp,multiConvoPermissionsSchema:()=>Cm,navigationMenu:()=>Xp,omitsSamplingParameters:()=>Qf,omitsThinkingByDefault:()=>Zf,openAISchema:()=>j,openAISettings:()=>w,openRouterSchema:()=>Bt,openapiToFunction:()=>th,pagination:()=>Zp,paramSettings:()=>Fh,parseCompactConvo:()=>yp,parseConvo:()=>mp,parseEphemeralAgentId:()=>wp,parseTextParts:()=>bp,peoplePickerPermissionsSchema:()=>Dm,permissionsSchema:()=>Fm,popover:()=>Qp,presetSettings:()=>Rh,progress:()=>$p,promptPermissionsSchema:()=>ym,promptTokensFromUsage:()=>sp,radioGroup:()=>em,reconcileContextUsage:()=>cp,remoteAgentsPermissionsSchema:()=>Mm,removeNullishValues:()=>A,replaceSpecialVars:()=>Sp,resolveRef:()=>$m,resolveThinkingDisplay:()=>qf,roleDefaults:()=>Vm,roleSchema:()=>Lm,runCodePermissionsSchema:()=>Tm,select:()=>tm,separator:()=>nm,sha1:()=>Gm,shadcnComponents:()=>hm,sharedLinksPermissionsSchema:()=>Pm,skeleton:()=>rm,skillPermissionsSchema:()=>Nm,slider:()=>im,stripAgentIdSuffix:()=>Ep,supportsAdaptiveThinking:()=>Xf,switchComponent:()=>am,tConversationSchema:()=>k,tConvoUpdateSchema:()=>Mt,table:()=>om,tabs:()=>sm,temporaryChatPermissionsSchema:()=>wm,textarea:()=>cm,toast:()=>lm,toaster:()=>um,toggle:()=>fm,toggleGroup:()=>dm,tooltip:()=>pm,useToast:()=>mm,utils:()=>Ap,validateAndParseOpenAPISpec:()=>nh,webSearchPermissionsSchema:()=>Em}),Rf=e(re(),1),zf=e(ce(),1),Bf=e(se(),1),Vf=e(ae(),1),Hf=2e3,Uf=`output-128k-2025-02-19`,Wf=`fine-grained-tool-streaming-2025-05-14`,Gf=new Set(Object.values(Ye));function Kf(e){if(typeof e!=`object`||!e)return;let t=e.thinking;if(typeof t!=`object`||!t)return;let n=t.display;return typeof n==`string`?n:void 0}function qf(e,t){if(t===`summarized`)return`summarized`;if(t===`omitted`)return`omitted`;if(Zf(e))return`summarized`}function Jf(e){let t=e.match(/claude-opus[-.]?(\d+)(?:[-.](\d{1,2})(?!\d))?/);if(t)return{major:parseInt(t[1],10),minor:t[2]==null?0:parseInt(t[2],10)};let n=e.match(/claude-(\d+)(?:[-.](\d{1,2})(?!\d))?-opus/);return n?{major:parseInt(n[1],10),minor:n[2]==null?0:parseInt(n[2],10)}:null}function Yf(e){let t=e.match(/claude-sonnet[-.]?(\d+)(?:[-.](\d)(?!\d))?/);if(t)return{major:parseInt(t[1],10),minor:t[2]==null?0:parseInt(t[2],10)};let n=e.match(/claude-(\d+)(?:[-.](\d)(?!\d))?-sonnet/);return n?{major:parseInt(n[1],10),minor:n[2]==null?0:parseInt(n[2],10)}:null}function Xf(e){let t=Jf(e);if(t&&(t.major>4||t.major===4&&t.minor>=6))return!0;let n=Yf(e);return!!(n!=null&&(n.major>4||n.major===4&&n.minor>=6)||St(e))}function Zf(e){let t=Jf(e);return!!(t&&(t.major>4||t.major===4&&t.minor>=7)||St(e))}function Qf(e){let t=Jf(e);return!!(t&&(t.major>4||t.major===4&&t.minor>=7)||St(e))}function $f(e){let t=[],n=/anthropic\.claude-(?:[4-9](?:\.\d+)?(?:-\d+)?-(?:sonnet|opus|haiku)|(?:sonnet|opus|haiku)-[4-9])/.test(e);return(e.includes(`anthropic.claude-3-7-sonnet`)||n)&&t.push(Uf),n&&t.push(Wf),t}function ep(e,t){let n=[];Array.isArray(e)?n=e:typeof e==`string`&&(n=[e]);let r=new Set;return[...n,...t].forEach(e=>{typeof e==`string`&&e.split(`,`).map(e=>e.trim()).filter(Boolean).forEach(e=>r.add(e))}),Array.from(r)}var tp=k.pick({chatProjectId:!0,modelLabel:!0,promptPrefix:!0,resendFiles:!0,iconURL:!0,greeting:!0,spec:!0,maxOutputTokens:!0,maxContextTokens:!0,artifacts:!0,region:!0,system:!0,model:!0,maxTokens:!0,temperature:!0,topP:!0,stop:!0,thinking:!0,thinkingBudget:!0,effort:!0,thinkingDisplay:!0,reasoning_effort:!0,promptCache:!0,promptCacheTtl:!0,topK:!0,additionalModelRequestFields:!0}).transform(e=>{if(e.additionalModelRequestFields?.thinking!=null){let t=e.additionalModelRequestFields.thinking;if(e.thinking=!!t,e.thinkingBudget=typeof t==`object`&&`budget_tokens`in t?t.budget_tokens:void 0,e.thinkingDisplay==null){let n=Kf({thinking:t});(n===`summarized`||n===`omitted`)&&(e.thinkingDisplay=n)}delete e.additionalModelRequestFields}return A(e)}).catch(()=>({}));k.pick({chatProjectId:!0,modelLabel:!0,promptPrefix:!0,resendFiles:!0,iconURL:!0,greeting:!0,spec:!0,artifacts:!0,maxOutputTokens:!0,maxContextTokens:!0,region:!0,model:!0,maxTokens:!0,temperature:!0,topP:!0,stop:!0,thinking:!0,thinkingBudget:!0,effort:!0,thinkingDisplay:!0,reasoning_effort:!0,promptCache:!0,promptCacheTtl:!0,topK:!0,additionalModelRequestFields:!0}).catchall(ne()).transform(e=>{let t=[`chatProjectId`,`modelLabel`,`promptPrefix`,`resendFiles`,`iconURL`,`greeting`,`spec`,`maxOutputTokens`,`artifacts`,`additionalModelRequestFields`,`region`,`model`,`maxTokens`,`temperature`,`topP`,`stop`,`promptCache`,`promptCacheTtl`],n={},r=e,i=typeof r.model==`string`&&Qf(r.model);if(Object.entries(r).forEach(([e,i])=>{t.includes(e)||(e===`topK`?n.top_k=i:n[e]=i,delete r[e])}),typeof r.model==`string`&&(r.model.includes(`anthropic.claude-3-7-sonnet`)||/anthropic\.claude-(?:[4-9](?:\.\d+)?(?:-\d+)?-(?:sonnet|opus|haiku)|(?:sonnet|opus|haiku)-[4-9])/.test(r.model)||St(r.model))){if(Xf(r.model)){let e=n.effort;if(e&&typeof e==`string`&&e!==``&&(n.output_config={effort:e}),delete n.effort,n.thinking===!1)delete n.thinking,delete n.thinkingBudget,delete n.thinkingDisplay;else{let e=n.thinkingDisplay,t=Kf(r.additionalModelRequestFields),i={type:`adaptive`},a=qf(r.model,e??t);a&&(i.display=a),n.thinking=i,delete n.thinkingBudget,delete n.thinkingDisplay}}else n.thinking===void 0?n.thinking=!0:n.thinking===!1&&(delete n.thinking,delete n.thinkingBudget),n.thinking===!0&&n.thinkingBudget===void 0&&(n.thinkingBudget=Hf),delete n.effort,delete n.thinkingDisplay;if(delete n.reasoning_effort,r.model.includes(`anthropic.`)){let e=$f(r.model);if(e.length>0){let t=r.additionalModelRequestFields?.anthropic_beta;n.anthropic_beta=ep(t,e)}}}else{delete n.thinking,delete n.thinkingBudget,delete n.effort,delete n.thinkingDisplay,delete n.output_config,delete n.anthropic_beta;let e=n.reasoning_effort;delete n.reasoning_effort,typeof e==`string`&&Gf.has(e)&&(n.reasoning_config=e)}let a=typeof r.model==`string`&&r.model.includes(`anthropic.`);if(typeof r.additionalModelRequestFields==`object`&&r.additionalModelRequestFields!=null){let e=r.additionalModelRequestFields;a?(delete e.reasoning_config,delete e.reasoning_effort):(delete e.anthropic_beta,delete e.thinking,delete e.thinkingBudget,delete e.effort,delete e.output_config,delete e.reasoning_config),i&&(delete e.temperature,delete e.topP,delete e.top_p,delete e.topK,delete e.top_k)}return i&&(delete r.temperature,delete r.topP,delete n.temperature,delete n.topP,delete n.top_p,delete n.topK,delete n.top_k),typeof r.model==`string`&&(r.model.includes(`claude`)||r.model.includes(`nova`))?r.promptCache===void 0&&(r.promptCache=!0):r.promptCache===!0&&(r.promptCache=void 0),r.promptCache!==!0&&(r.promptCacheTtl=void 0),Object.keys(n).length>0&&(r.additionalModelRequestFields={...r.additionalModelRequestFields||{},...n}),r.maxOutputTokens===void 0?r.maxTokens!==void 0&&(r.maxOutputTokens=r.maxTokens):r.maxTokens=r.maxOutputTokens,A(r)}).catch(()=>({}));var np=function(e){return e.TEXT=`text`,e.THINK=`think`,e.TEXT_DELTA=`text_delta`,e.TOOL_CALL=`tool_call`,e.IMAGE_FILE=`image_file`,e.IMAGE_URL=`image_url`,e.VIDEO_URL=`video_url`,e.INPUT_AUDIO=`input_audio`,e.AGENT_UPDATE=`agent_update`,e.SUMMARY=`summary`,e.ERROR=`error`,e}({}),rp=function(e){return e.TOOL_CALLS=`tool_calls`,e.MESSAGE_CREATION=`message_creation`,e}({}),ip=function(e){return e.FUNCTION=`function`,e.RETRIEVAL=`retrieval`,e.FILE_SEARCH=`file_search`,e.CODE_INTERPRETER=`code_interpreter`,e.TOOL_CALL=`tool_call`,e}({}),ap=function(e){return e.ON_RUN_STEP=`on_run_step`,e.ON_AGENT_UPDATE=`on_agent_update`,e.ON_MESSAGE_DELTA=`on_message_delta`,e.ON_REASONING_DELTA=`on_reasoning_delta`,e.ON_RUN_STEP_DELTA=`on_run_step_delta`,e.ON_RUN_STEP_COMPLETED=`on_run_step_completed`,e.ON_SUMMARIZE_START=`on_summarize_start`,e.ON_SUMMARIZE_DELTA=`on_summarize_delta`,e.ON_SUMMARIZE_COMPLETE=`on_summarize_complete`,e.ON_SUBAGENT_UPDATE=`on_subagent_update`,e}({}),op=function(e){return e.ON_CONTEXT_USAGE=`on_context_usage`,e.ON_TOKEN_USAGE=`on_token_usage`,e}({}),sp=e=>{let t=e.input_tokens??0,n=e.input_token_details??{},r=n.cache_read??0,i=n.cache_creation??0;return(e.provider==null?r+i<=t:Pe(e.provider))?t:t+r+i},cp=(e,t)=>{if(!Number.isFinite(t)||t<=0)return e;let{breakdown:n}=e,r=e.contextBudget??n.maxContextTokens,i=(n.instructionTokens??0)+(n.summaryTokens??0),a=Math.max(0,t-i);return{...e,breakdown:{...n,messageTokens:a},remainingContextTokens:r==null?e.remainingContextTokens:Math.max(0,r-t)}};Rf.default.extend(zf.default),Rf.default.extend(Bf.default);var lp={openAI:j,azureOpenAI:j,custom:j,openrouter:Bt,google:It,anthropic:Ht,assistants:Lt,azureAssistants:Lt,agents:Ut,bedrock:tp},up=e=>e!=null&&Object.prototype.hasOwnProperty.call(lp,e),dp=(e,t,n)=>{if(t)return(up(n)?e[n]:void 0)??e[t]};function fp(e){let t;for(let n of e)if(n){t=n;break}return t}function pp(e){for(let t of e)if(t&&t.trim()!==``)return t}var mp=({endpoint:e,endpointType:t,conversation:n,possibleValues:r,defaultParamsEndpoint:i})=>{let a=lp[e];if(!a&&!t)throw Error(`Unknown endpoint: ${e}`);let o=(a??dp(lp,t,i))?.parse(n),{models:s}=r??{};return s&&o&&(o.model=fp(s)??o.model),o},hp=e=>{let t=e.match(/gpt-(\d+(?:\.\d+)?)([a-z])?/i);return t?`GPT-${t[1]}${t[2]||``}`:``},gp=e=>{let t=e.match(/\bo(\d+(?:\.\d+)?)\b/i);return t?`o${t[1]}`:``},_p=e=>{let{model:t,endpoint:n,endpointType:r,modelDisplayLabel:i,chatGptLabel:a,modelLabel:o}=e,s=n,c=t??``,l=i??``,u=a??``,d=o??``;return[`openAI`,`bedrock`,`azureOpenAI`].includes(s)?d||u||(c&&gp(c)?gp(c):c&&(c.includes(`mistral`)||c.includes(`codestral`))?`Mistral`:c&&c.includes(`deepseek`)?`Deepseek`:c&&c.includes(`kimi`)?`Kimi`:c&&c.includes(`moonshot`)?`Moonshot`:c&&c.includes(`gpt-`)?hp(c)||`GPT`:As[s]??`AI`):s===`anthropic`?d||`Claude`:s===`bedrock`?d||As[s]:s===`google`?d||(c?.toLowerCase().includes(`gemma`)===!0?`Gemma`:`Gemini`):s===`custom`||r===`custom`?d||u||(c&&gp(c)?gp(c):c&&(c.includes(`mistral`)||c.includes(`codestral`))?`Mistral`:c&&c.includes(`deepseek`)?`Deepseek`:c&&c.includes(`kimi`)?`Kimi`:c&&c.includes(`moonshot`)?`Moonshot`:c&&c.includes(`gpt-`)?hp(c)||`GPT`:l||`AI`):``},vp={openAI:j,azureOpenAI:j,custom:j,openrouter:Bt,assistants:Rt,azureAssistants:Rt,agents:Ut,google:Vt,bedrock:tp,anthropic:Ht},yp=({endpoint:e,endpointType:t,conversation:n,possibleValues:r,defaultParamsEndpoint:i})=>{if(!e)throw Error(`undefined endpoint: ${e}`);let a=vp[e];if(!a&&!t)throw Error(`Unknown endpoint: ${e}`);let o=a??dp(vp,t,i);if(!o)throw Error(`Unknown endpointType: ${t}`);let{iconURL:s,...c}=n,l=o.parse(c),{models:u}=r??{};return u&&l&&(l.model=fp(u)??l.model),l};function bp(e,t=!1){let n=``;for(let r of e)if(r?.type){if(r.type===`text`){let e=(typeof r.text==`string`?r.text:r.text?.value)||``;n.length>0&&e.length>0&&n[n.length-1]!==` `&&e[0]!==` `&&(n+=` `),n+=e}else if(r.type===`think`&&!t){let e=typeof r.think==`string`?r.think:``;n.length>0&&e.length>0&&n[n.length-1]!==` `&&e[0]!==` `&&(n+=` `),n+=e}}return n}function xp(e,t){if(!t)return e;try{let n=e.tz(t);return n.isValid()?n:e}catch{return e}}function Sp({text:e,user:t,now:n,timezone:r}){let i=e;if(!i)return i;let a=xp(n==null?(0,Rf.default)():(0,Rf.default)(n),r),o=a.format(`dddd`),s=a.format(`YYYY-MM-DD`);i=i.replace(/{{\s*current_date\s*}}/gi,`${s} (${o})`);let c=a.format(`YYYY-MM-DD HH:mm:ss Z`);i=i.replace(/{{\s*current_datetime\s*}}/gi,`${c} (${o})`);let l=a.toISOString();return i=i.replace(/{{\s*iso_datetime\s*}}/gi,l),t&&t.name&&(i=i.replace(/{{\s*current_user\s*}}/gi,t.name)),i}function Cp({endpoint:e,model:t,sender:n,index:r}){let i=`${e}:${t}`.replace(/:/g,`__`),a=i;return n&&(a=`${i}___${n.replace(/:/g,`__`)}`),r!=null&&(a=`${a}____${r}`),a}function wp(e){if(!e.includes(`__`))return;let t,n=e;if(e.includes(`____`)){let r=e.lastIndexOf(`____`),i=e.slice(r+4),a=parseInt(i,10);isNaN(a)||(t=a,n=e.slice(0,r))}let r,i=n;if(n.includes(`___`)){let[e,t]=n.split(`___`);i=e,r=t?.replace(/__/g,`:`)}let[a,...o]=i.split(`__`);if(!(!a||o.length===0))return{endpoint:a,model:o.join(`:`),sender:r,index:t}}function Tp(e){return!e?.startsWith(`agent_`)}function Ep(e){return e.replace(/____\d+$/,``)}function Dp(e,t){return`${e}____${t}`}function Op({messages:e,fileMap:t}){if(e===null)return null;let n={},r=[],i={};return e.forEach(e=>{if(!e)return;let a=e.parentMessageId??``;i[a]=(i[a]||0)+1;let o={...e,children:[],depth:0,siblingIndex:i[a]-1};e.files&&t&&(o.files=e.files.map(e=>t[e.file_id??``]??e)),n[e.messageId]=o;let s=n[a];s?(s.children.push(o),o.depth=s.depth+1):r.push(o)}),r}var kp=function(e){return e.DEFAULT=`default`,e.SHADCNUI=`shadcnui`,e.CUSTOM=`custom`,e}({}),Ap=`
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,jp=`import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`,Mp=`import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
`,Np=`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border border-gray-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-950 dark:border-gray-800 dark:[&>svg]:text-gray-50",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "border-red-500/50 text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

`,Pp=`import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "../../lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

`,Fp=`import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
        secondary:
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive:
          "border-transparent bg-red-500 text-gray-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
        outline: "text-gray-950 dark:text-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

`,Ip=`import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-gray-500 sm:gap-2.5 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-gray-950 dark:hover:text-gray-50", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-gray-950 dark:text-gray-50", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}

`,Lp=`import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
        destructive:
          "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
        outline:
          "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "text-gray-900 underline-offset-4 hover:underline dark:text-gray-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,Rp=`import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-gray-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-100/50 [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-gray-800/50 dark:[&:has([aria-selected])]:bg-gray-800",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gray-900 text-gray-50 hover:bg-gray-900 hover:text-gray-50 focus:bg-gray-900 focus:text-gray-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50 dark:hover:text-gray-900 dark:focus:bg-gray-50 dark:focus:text-gray-900",
        day_today: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
        day_outside:
          "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30 dark:text-gray-400 dark:aria-selected:bg-gray-800/50 dark:aria-selected:text-gray-400",
        day_disabled: "text-gray-500 opacity-50 dark:text-gray-400",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

`,zp=`import * as React from 'react';

import { cn } from '../../lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,Bp=`import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}

`,Vp=`import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-200 dark:border-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50  dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=checked]:bg-gray-50 dark:data-[state=checked]:text-gray-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

`,Hp=`import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

`,Up=`import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500 dark:ring-offset-gray-950 dark:focus:ring-gray-300 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-400">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

`,Wp=`import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "../../lib/utils"

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-100 dark:bg-gray-800" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

`,Gp=`import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[state=open]:bg-gray-100 dark:focus:bg-gray-800 dark:data-[state=open]:bg-gray-800",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}

`,Kp=`import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "../../lib/utils"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }

`,qp=`import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`,Jp=`import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
`,Yp=`
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const MenubarMenu = MenubarPrimitive.Menu

const MenubarGroup = MenubarPrimitive.Group

const MenubarPortal = MenubarPrimitive.Portal

const MenubarSub = MenubarPrimitive.Sub

const MenubarRadioGroup = MenubarPrimitive.RadioGroup

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-950",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-gray-100 focus:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-50",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[state=open]:bg-gray-800 dark:data-[state=open]:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}

`,Xp=`import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{""}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)] dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-gray-200 shadow-md dark:bg-gray-800" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}

`,Zp=`import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../lib/utils"
import { ButtonProps, buttonVariants } from "./button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

`,Qp=`import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }

`,$p=`import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "../../lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
`,em=`import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-gray-200 dark:border-gray-900 text-gray-900 ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-gray-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

`,tm=`import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-300",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-800 dark:focus:text-gray-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

`,nm=`import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-gray-200 dark:bg-gray-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

`,rm=`import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-100 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
`,im=`import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
      <SliderPrimitive.Range className="absolute h-full bg-gray-900 dark:bg-gray-50" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-gray-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-50 dark:bg-gray-950 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

`,am=`import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200 dark:focus-visible:ring-gray-300 dark:focus-visible:ring-offset-gray-950 dark:data-[state=checked]:bg-gray-50 dark:data-[state=unchecked]:bg-gray-800",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-gray-950"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

`,om=`import * as React from "react"

import { cn } from "../../lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-100/50 font-medium [&>tr]:last:border-b-0 dark:bg-gray-800/50",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 dark:hover:bg-gray-800/50 dark:data-[state=selected]:bg-gray-800",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

`,sm=`import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-gray-950 dark:data-[state=active]:text-gray-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

`,cm=`import * as React from "react"

import { cn } from "../../lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

`,lm=`import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-gray-200 p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-gray-800",
  {
    variants: {
      variant: {
        default: "border bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50",
        destructive:
          "destructive group border-red-500 bg-red-500 text-gray-50 dark:border-red-900 dark:bg-red-900 dark:text-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-transparent px-3 text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-gray-100/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-gray-50 group-[.destructive]:focus:ring-red-500 dark:border-gray-800 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:focus:ring-gray-300 dark:group-[.destructive]:border-gray-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-gray-50 dark:group-[.destructive]:focus:ring-red-900",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-950/50 opacity-0 transition-opacity hover:text-gray-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-gray-50/50 dark:hover:text-gray-50",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

`,um=`import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

`,dm=`import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"
import { toggleVariants } from "./toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }

`,fm=`import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-400 dark:focus-visible:ring-gray-300 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-gray-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }

`,pm=`import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

`,mm=`import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "./toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
`,hm={utils:Ap,accordian:jp,alertDialog:Mp,alert:Np,avatar:Pp,badge:Fp,breadcrumb:Ip,button:Lp,calendar:Rp,card:zp,carousel:Bp,checkbox:Vp,collapsible:Hp,dialog:Up,drawer:Wp,dropdownMenu:Gp,hoverCard:Kp,input:qp,label:Jp,menuBar:Yp,navigationMenu:Xp,pagination:Zp,popover:Qp,progress:$p,radioGroup:em,select:tm,separator:nm,skeleton:rm,slider:im,switchComponent:am,table:om,tabs:sm,textarea:cm,toast:lm,toaster:um,toggleGroup:dm,toggle:fm,tooltip:pm,useToast:mm},gm=function(e){return e.PROMPTS=`PROMPTS`,e.BOOKMARKS=`BOOKMARKS`,e.AGENTS=`AGENTS`,e.MEMORIES=`MEMORIES`,e.MULTI_CONVO=`MULTI_CONVO`,e.TEMPORARY_CHAT=`TEMPORARY_CHAT`,e.RUN_CODE=`RUN_CODE`,e.WEB_SEARCH=`WEB_SEARCH`,e.PEOPLE_PICKER=`PEOPLE_PICKER`,e.MARKETPLACE=`MARKETPLACE`,e.FILE_SEARCH=`FILE_SEARCH`,e.FILE_CITATIONS=`FILE_CITATIONS`,e.MCP_SERVERS=`MCP_SERVERS`,e.REMOTE_AGENTS=`REMOTE_AGENTS`,e.SKILLS=`SKILLS`,e.SHARED_LINKS=`SHARED_LINKS`,e}({}),_m={PROMPTS:`prompts`,AGENTS:`agents`,BOOKMARKS:`bookmarks`,MEMORIES:`memories`,MULTI_CONVO:`multiConvo`,TEMPORARY_CHAT:`temporaryChat`,RUN_CODE:`runCode`,WEB_SEARCH:`webSearch`,FILE_SEARCH:`fileSearch`,FILE_CITATIONS:`fileCitations`,PEOPLE_PICKER:`peoplePicker`,MARKETPLACE:`marketplace`,MCP_SERVERS:`mcpServers`,REMOTE_AGENTS:`remoteAgents`,SKILLS:`skills`,SHARED_LINKS:`sharedLinks`};new Set(Object.values(_m));var vm=function(e){return e.USE=`USE`,e.CREATE=`CREATE`,e.UPDATE=`UPDATE`,e.READ=`READ`,e.READ_AUTHOR=`READ_AUTHOR`,e.SHARE=`SHARE`,e.OPT_OUT=`OPT_OUT`,e.VIEW_USERS=`VIEW_USERS`,e.VIEW_GROUPS=`VIEW_GROUPS`,e.VIEW_ROLES=`VIEW_ROLES`,e.SHARE_PUBLIC=`SHARE_PUBLIC`,e.CONFIGURE_OBO=`CONFIGURE_OBO`,e}({}),ym=_({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!1),SHARE_PUBLIC:c().default(!1)}),bm=_({USE:c().default(!0)}),xm=_({USE:c().default(!0),CREATE:c().default(!0),UPDATE:c().default(!0),READ:c().default(!0),OPT_OUT:c().default(!0)}),Sm=_({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!1),SHARE_PUBLIC:c().default(!1)}),Cm=_({USE:c().default(!0)}),wm=_({USE:c().default(!0)}),Tm=_({USE:c().default(!0)}),Em=_({USE:c().default(!0)}),Dm=_({VIEW_USERS:c().default(!0),VIEW_GROUPS:c().default(!0),VIEW_ROLES:c().default(!0)}),Om=_({USE:c().default(!1)}),km=_({USE:c().default(!0)}),Am=_({USE:c().default(!0)}),jm=_({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!1),SHARE_PUBLIC:c().default(!1),CONFIGURE_OBO:c().default(!1)}),Mm=_({USE:c().default(!1),CREATE:c().default(!1),SHARE:c().default(!1),SHARE_PUBLIC:c().default(!1)}),Nm=_({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!1),SHARE_PUBLIC:c().default(!1)}),Pm=_({CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!1)}),Fm=_({PROMPTS:ym,BOOKMARKS:bm,MEMORIES:xm,AGENTS:Sm,MULTI_CONVO:Cm,TEMPORARY_CHAT:wm,RUN_CODE:Tm,WEB_SEARCH:Em,PEOPLE_PICKER:Dm,MARKETPLACE:Om,FILE_SEARCH:km,FILE_CITATIONS:Am,MCP_SERVERS:jm,REMOTE_AGENTS:Mm,SKILLS:Nm,SHARED_LINKS:Pm}),Im=function(e){return e.ADMIN=`ADMIN`,e.USER=`USER`,e}({}),Lm=_({name:p(),permissions:Fm}),Rm=_({ADMIN:Lm.extend({name:g(`ADMIN`),permissions:Fm.extend({PROMPTS:ym.extend({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0)}),BOOKMARKS:bm.extend({USE:c().default(!0)}),MEMORIES:xm.extend({USE:c().default(!0),CREATE:c().default(!0),UPDATE:c().default(!0),READ:c().default(!0),OPT_OUT:c().default(!0)}),AGENTS:Sm.extend({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0)}),MULTI_CONVO:Cm.extend({USE:c().default(!0)}),TEMPORARY_CHAT:wm.extend({USE:c().default(!0)}),RUN_CODE:Tm.extend({USE:c().default(!0)}),WEB_SEARCH:Em.extend({USE:c().default(!0)}),PEOPLE_PICKER:Dm.extend({VIEW_USERS:c().default(!0),VIEW_GROUPS:c().default(!0),VIEW_ROLES:c().default(!0)}),MARKETPLACE:_({USE:c().default(!1)}),FILE_SEARCH:km.extend({USE:c().default(!0)}),FILE_CITATIONS:Am.extend({USE:c().default(!0)}),MCP_SERVERS:jm.extend({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0),CONFIGURE_OBO:c().default(!0)}),REMOTE_AGENTS:Mm.extend({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0)}),SKILLS:Nm.extend({USE:c().default(!0),CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0)}),SHARED_LINKS:Pm.extend({CREATE:c().default(!0),SHARE:c().default(!0),SHARE_PUBLIC:c().default(!0)})})}),USER:Lm.extend({name:g(`USER`),permissions:Fm})}),zm=new Set(Object.values(Im).map(e=>e.toUpperCase()));function Bm(e){return e?zm.has(e.toUpperCase()):!1}var Vm=Rm.parse({ADMIN:{name:`ADMIN`,permissions:{PROMPTS:{USE:!0,CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0},BOOKMARKS:{USE:!0},MEMORIES:{USE:!0,CREATE:!0,UPDATE:!0,READ:!0,OPT_OUT:!0},AGENTS:{USE:!0,CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0},MULTI_CONVO:{USE:!0},TEMPORARY_CHAT:{USE:!0},RUN_CODE:{USE:!0},WEB_SEARCH:{USE:!0},PEOPLE_PICKER:{VIEW_USERS:!0,VIEW_GROUPS:!0,VIEW_ROLES:!0},MARKETPLACE:{USE:!0},FILE_SEARCH:{USE:!0},FILE_CITATIONS:{USE:!0},MCP_SERVERS:{USE:!0,CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0,CONFIGURE_OBO:!0},REMOTE_AGENTS:{USE:!0,CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0},SKILLS:{USE:!0,CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0},SHARED_LINKS:{CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0}}},USER:{name:`USER`,permissions:{PROMPTS:{USE:!0,CREATE:!0,SHARE:!1,SHARE_PUBLIC:!1},BOOKMARKS:{},MEMORIES:{},AGENTS:{USE:!0,CREATE:!0,SHARE:!1,SHARE_PUBLIC:!1},MULTI_CONVO:{},TEMPORARY_CHAT:{},RUN_CODE:{},WEB_SEARCH:{},PEOPLE_PICKER:{VIEW_USERS:!1,VIEW_GROUPS:!1,VIEW_ROLES:!1},MARKETPLACE:{USE:!1},FILE_SEARCH:{},FILE_CITATIONS:{},MCP_SERVERS:{USE:!0,CREATE:!1,SHARE:!1,SHARE_PUBLIC:!1,CONFIGURE_OBO:!1},REMOTE_AGENTS:{USE:!1,CREATE:!1,SHARE:!1,SHARE_PUBLIC:!1},SKILLS:{USE:!0,CREATE:!0,SHARE:!1,SHARE_PUBLIC:!1},SHARED_LINKS:{CREATE:!0,SHARE:!0,SHARE_PUBLIC:!0}}}}),Hm=function(e){return e.auto=`auto`,e.manual=`manual`,e.both=`both`,e}({}),Um=1024,Wm=/^[a-z0-9][a-z0-9-]*$/;function Gm(e){return Vf.createHash(`sha1`).update(e).digest(`hex`)}function Km(e,t){return new ie(`${e.replace(/\/$/,``)}/${t.replace(/^\//,``)}`).toString()}var qm={string:e=>{if(e.enum)return y(e.enum);let t=p();return e.minLength!==void 0&&(t=t.min(e.minLength)),e.maxLength!==void 0&&(t=t.max(e.maxLength)),t},number:e=>{let t=v();return e.minimum!==void 0&&(t=t.min(e.minimum)),e.maximum!==void 0&&(t=t.max(e.maximum)),t},integer:e=>qm.number(e).int(),boolean:()=>c(),array:e=>e.items?h(Jm(e.items)||S()):h(S()),object:e=>{let t={};return e.properties&&Object.entries(e.properties).forEach(([n,r])=>{t[n]=Jm(r)||S(),e.required&&e.required.includes(n)?t[n]=t[n].describe(r.description||``):t[n]=t[n].optional().describe(r.description||``)}),_(t)}};function Jm(e){if(!(e.type===`object`&&Object.keys(e.properties||{}).length===0))return(qm[e.type]||(()=>S()))(e)}var Ym=class{constructor(e,t,n,r){this.name=e,this.description=t,this.parameters=n,this.strict=r??!1}toObjectTool(){let e={...this.parameters,additionalProperties:this.strict?!1:void 0};return{type:`function`,function:{name:this.name,description:this.description,parameters:e,...this.strict?{strict:this.strict}:{}}}}},Xm=class{constructor(e,t,n,r,i,a,o){this.domain=e,this.basePath=t,this.method=n,this.operation=r,this.isConsequential=i,this.contentType=a,this.parameterLocations=o}},Zm=class{constructor(e){this.config=e,this.authHeaders={},this.path=e.basePath}setParams(e){if(this.operationHash=Gm(JSON.stringify(e)),this.params={...e},this.config.parameterLocations){for(let[t,n]of Object.entries(e))if(this.config.parameterLocations[t]===`path`){let e=`{${t}}`;this.path.includes(e)&&(this.path=this.path.replace(e,encodeURIComponent(String(n))),delete this.params[t])}}else for(let[t,n]of Object.entries(e)){let e=`{${t}}`;this.path.includes(e)&&(this.path=this.path.replace(e,encodeURIComponent(String(n))),delete this.params[t])}return this}async setAuth(e){if(!e.auth)return this;let{type:t,authorization_type:r,custom_auth_header:i,authorization_url:a,client_url:o,scope:s,token_exchange_method:c}=e.auth,{api_key:l,oauth_client_id:u,oauth_client_secret:d,oauth_token_expires_at:f,oauth_access_token:p=``}=e,m=l!=null&&l.length>0&&t===`service_http`,h=!!(u!=null&&u&&d!=null&&d&&t===`oauth`&&a!=null&&a&&o!=null&&o&&s!=null&&s&&c);if(m&&r===`basic`){let e=n.from(l).toString(`base64`);this.authHeaders.Authorization=`Basic ${e}`}else if(m&&r===`bearer`)this.authHeaders.Authorization=`Bearer ${l}`;else if(m&&r===`custom`&&i!=null&&i)this.authHeaders[i]=l;else if(h){let e=new Date;if(!p)throw Error(`No access token found. Please log in first.`);if(f&&e>=new Date(f))throw Error(`Access token is expired. Please re-login.`);this.authToken=p,this.authHeaders.Authorization=`Bearer ${this.authToken}`}return this}async execute(e){let t=Km(this.config.domain,this.path),n={...this.authHeaders,...this.config.contentType?{"Content-Type":this.config.contentType}:{}},i=this.config.method.toLowerCase(),a=r.create({maxRedirects:0,validateStatus:e=>e>=200&&e<400,...e?.httpAgent==null?{}:{httpAgent:e.httpAgent},...e?.httpsAgent==null?{}:{httpsAgent:e.httpsAgent}}),o={},s={};if(this.config.parameterLocations&&this.params)for(let e of Object.keys(this.params)){let t=this.config.parameterLocations[e]||(i===`get`?`query`:`body`),r=this.params[e];t===`query`?o[e]=r:t===`header`?n[e]=String(r):t===`body`&&(s[e]=r)}else this.params&&(Object.assign(o,this.params),Object.assign(s,this.params));if(i===`get`)return a.get(t,{headers:n,params:o});if(i===`post`)return a.post(t,s,{headers:n,params:o});if(i===`put`)return a.put(t,s,{headers:n,params:o});if(i===`delete`)return a.delete(t,{headers:n,data:s,params:o});if(i===`patch`)return a.patch(t,s,{headers:n,params:o});throw Error(`Unsupported HTTP method: ${i}`)}getConfig(){return this.config}},Qm=class{constructor(e,t,n,r,i,a,o){this.config=new Xm(e,t,n,r,i,a,o)}get domain(){return this.config.domain}get path(){return this.config.basePath}get method(){return this.config.method}get operation(){return this.config.operation}get isConsequential(){return this.config.isConsequential}get contentType(){return this.config.contentType}createExecutor(){return new Zm(this.config)}setParams(e){let t=this.createExecutor();return t.setParams(e),t}async setAuth(e){return this.createExecutor().setAuth(e)}async execute(){return this.createExecutor().execute()}};function $m(e,t){if(`$ref`in e&&t){let n=e.$ref.replace(/^#\/components\//,``).split(`/`),r=t;for(let t of n)if(typeof r==`object`&&r&&t in r)r=r[t];else throw Error(`Could not resolve reference: ${e.$ref}`);return $m(r,t)}return e}function eh(e){return e.replace(/[^a-zA-Z0-9_-]/g,``)}function th(e,t=!1){let n=[],r={},i={},a=e.servers?.[0]?.url??``;for(let[o,s]of Object.entries(e.paths))for(let[c,l]of Object.entries(s)){let s={},u=l,d=`${c}_${o}`,f=u.operationId||eh(d),p=u.summary||u.description||``,m=u[`x-strict`]??!1,h={type:`object`,properties:{},required:[]};if(u.parameters)for(let t of u.parameters??[]){let n=$m(t,e.components),r=n.name;if(!r||!n.schema)continue;let i=$m(n.schema,e.components);h.properties[r]=i,n.required&&h.required.push(r),s[r]=n.in===`query`||n.in===`path`||n.in===`header`||n.in===`body`?n.in:`query`}let g=``;if(u.requestBody){let t=u.requestBody.content;g=Object.keys(t??{})[0];let n=t?.[g]?.schema,r=$m(n,e.components);if(h.properties={...h.properties,...r.properties},r.required&&h.required.push(...r.required),r.properties)for(let e in r.properties)s[e]=`body`;g??=`application/json`}let _=new Ym(f,p,h,m);if(n.push(_),r[f]=new Qm(a,o,c,f,!!(u[`x-openai-isConsequential`]??!1),g,s),t&&Object.keys(h.properties).length>0){let e=Jm(h);e&&(i[f]=e)}}return{functionSignatures:n,requestBuilders:r,zodSchemas:i}}function nh(e){try{let t;try{t=JSON.parse(e)}catch{t=oe(e)}if(!t.servers||!Array.isArray(t.servers)||t.servers.length===0||!t.servers[0].url)return{status:!1,message:"Could not find a valid URL in `servers`"};let n=t.paths;if(!n||typeof n!=`object`||Object.keys(n).length===0)return{status:!1,message:`No paths found in the OpenAPI spec.`};let r=t.components?.schemas||{},i=[];for(let[e,t]of Object.entries(n))for(let[n,a]of Object.entries(t)){let{responses:t}=a;if(typeof a==`object`&&t)for(let[a,o]of Object.entries(t)){let t=o.content;if(t&&t[`application/json`]&&t[`application/json`].schema){let o=t[`application/json`].schema;if(`$ref`in o&&typeof o.$ref==`string`){let t=o.$ref.split(`/`).pop();t&&!r[t]&&i.push(`In context=('paths', '${e}', '${n}', '${a}', 'response', 'content', 'application/json', 'schema'), reference to unknown component ${t}; using empty schema`)}}}}return{status:!0,message:i.join(`
`)||`OpenAPI spec is valid.`,spec:t,serverUrl:t.servers[0].url}}catch(e){return console.error(e),{status:!1,message:`Error parsing OpenAPI spec.`}}}function rh(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||void 0}catch{return}}function ih(e){let{isEdited:t,addedConvo:n,userMessage:r,isContinued:i,isTemporary:a,isRegenerate:o,conversation:s,editedContent:c,ephemeralAgent:l,endpointOption:u,manualSkills:d}=e,{conversationId:f}=Mt.parse(s),{endpoint:p,endpointType:m}=u,h=p,g=`${Rs.agents}/${h}`;Be(h)&&(g=Rs[m??h]+(t?`/modify`:``));let _={...r,...u,endpoint:h,addedConvo:n,isTemporary:a,isRegenerate:o,editedContent:c,conversationId:f,isContinued:!!(t&&i),ephemeralAgent:Be(h)?void 0:l,manualSkills:Be(h)?void 0:d,timezone:rh()};return{server:g,payload:_}}var K={model:{key:`model`,label:`com_ui_model`,labelCode:!0,type:`string`,component:`dropdown`,optionType:`model`,selectPlaceholder:`com_ui_select_model`,searchPlaceholder:`com_ui_select_search_model`,searchPlaceholderCode:!0,selectPlaceholderCode:!0,columnSpan:4},temperature:{key:`temperature`,label:`com_endpoint_temperature`,labelCode:!0,description:`com_endpoint_openai_temp`,descriptionCode:!0,type:`number`,component:`slider`,optionType:`model`,columnSpan:4},topP:{key:`topP`,label:`com_endpoint_top_p`,labelCode:!0,description:`com_endpoint_anthropic_topp`,descriptionCode:!0,type:`number`,component:`slider`,optionType:`model`,columnSpan:4},stop:{key:`stop`,label:`com_endpoint_stop`,labelCode:!0,description:`com_endpoint_openai_stop`,descriptionCode:!0,placeholder:`com_endpoint_stop_placeholder`,placeholderCode:!0,type:`array`,default:[],component:`tags`,optionType:`conversation`,minTags:0,maxTags:4},imageDetail:{key:`imageDetail`,label:`com_endpoint_plug_image_detail`,labelCode:!0,description:`com_endpoint_openai_detail`,descriptionCode:!0,type:`enum`,default:`auto`,component:`slider`,options:[`low`,`auto`,`high`],enumMappings:{low:`com_ui_low`,auto:`com_ui_auto`,high:`com_ui_high`},optionType:`conversation`,columnSpan:2}},q=(e,t)=>({...e,...t}),J={modelLabel:{key:`modelLabel`,label:`com_endpoint_custom_name`,labelCode:!0,type:`string`,default:``,component:`input`,placeholder:`com_endpoint_openai_custom_name_placeholder`,placeholderCode:!0,optionType:`conversation`},maxContextTokens:{key:`maxContextTokens`,label:`com_endpoint_context_tokens`,labelCode:!0,type:`number`,component:`input`,placeholder:`com_nav_theme_system`,placeholderCode:!0,description:`com_endpoint_context_info`,descriptionCode:!0,optionType:`model`,columnSpan:2},resendFiles:{key:`resendFiles`,label:`com_endpoint_plug_resend_files`,labelCode:!0,description:`com_endpoint_openai_resend_files`,descriptionCode:!0,type:`boolean`,default:!0,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},promptPrefix:{key:`promptPrefix`,label:`com_endpoint_prompt_prefix`,labelCode:!0,type:`string`,default:``,component:`textarea`,placeholder:`com_endpoint_openai_prompt_prefix_placeholder`,placeholderCode:!0,optionType:`model`},fileTokenLimit:{key:`fileTokenLimit`,label:`com_ui_file_token_limit`,labelCode:!0,description:`com_ui_file_token_limit_desc`,descriptionCode:!0,placeholder:`com_nav_theme_system`,placeholderCode:!0,type:`number`,component:`input`,columnSpan:2}},Y={chatGptLabel:{...J.modelLabel,key:`chatGptLabel`},promptPrefix:J.promptPrefix,temperature:q(K.temperature,{default:w.temperature.default,range:{min:w.temperature.min,max:w.temperature.max,step:w.temperature.step}}),top_p:q(K.topP,{key:`top_p`,default:w.top_p.default,range:{min:w.top_p.min,max:w.top_p.max,step:w.top_p.step}}),frequency_penalty:{key:`frequency_penalty`,label:`com_endpoint_frequency_penalty`,labelCode:!0,description:`com_endpoint_openai_freq`,descriptionCode:!0,type:`number`,default:w.frequency_penalty.default,range:{min:w.frequency_penalty.min,max:w.frequency_penalty.max,step:w.frequency_penalty.step},component:`slider`,optionType:`model`,columnSpan:4},presence_penalty:{key:`presence_penalty`,label:`com_endpoint_presence_penalty`,labelCode:!0,description:`com_endpoint_openai_pres`,descriptionCode:!0,type:`number`,default:w.presence_penalty.default,range:{min:w.presence_penalty.min,max:w.presence_penalty.max,step:w.presence_penalty.step},component:`slider`,optionType:`model`,columnSpan:4},max_tokens:{key:`max_tokens`,label:`com_endpoint_max_output_tokens`,labelCode:!0,type:`number`,component:`input`,description:`com_endpoint_openai_max_tokens`,descriptionCode:!0,placeholder:`com_nav_theme_system`,placeholderCode:!0,optionType:`model`,columnSpan:2},reasoning_effort:{key:`reasoning_effort`,label:`com_endpoint_reasoning_effort`,labelCode:!0,description:`com_endpoint_openai_reasoning_effort`,descriptionCode:!0,type:`enum`,default:``,component:`slider`,options:[``,`none`,`minimal`,`low`,`medium`,`high`,`xhigh`],enumMappings:{"":`com_ui_auto`,none:`com_ui_none`,minimal:`com_ui_minimal`,low:`com_ui_low`,medium:`com_ui_medium`,high:`com_ui_high`,xhigh:`com_ui_xhigh`},optionType:`model`,columnSpan:4},useResponsesApi:{key:`useResponsesApi`,label:`com_endpoint_use_responses_api`,labelCode:!0,description:`com_endpoint_openai_use_responses_api`,descriptionCode:!0,type:`boolean`,default:!1,component:`switch`,optionType:`model`,showDefault:!1,columnSpan:2},web_search:{key:`web_search`,label:`com_ui_web_search`,labelCode:!0,description:`com_endpoint_openai_use_web_search`,descriptionCode:!0,type:`boolean`,default:!1,component:`switch`,optionType:`model`,showDefault:!1,columnSpan:2},reasoning_summary:{key:`reasoning_summary`,label:`com_endpoint_reasoning_summary`,labelCode:!0,description:`com_endpoint_openai_reasoning_summary`,descriptionCode:!0,type:`enum`,default:``,component:`slider`,options:[``,`auto`,`concise`,`detailed`],enumMappings:{"":`com_ui_unset`,auto:`com_ui_auto`,concise:`com_ui_concise`,detailed:`com_ui_detailed`},optionType:`model`,columnSpan:4},verbosity:{key:`verbosity`,label:`com_endpoint_verbosity`,labelCode:!0,description:`com_endpoint_openai_verbosity`,descriptionCode:!0,type:`enum`,default:``,component:`slider`,options:[``,`low`,`medium`,`high`],enumMappings:{"":`com_ui_none`,low:`com_ui_low`,medium:`com_ui_medium`,high:`com_ui_high`},optionType:`model`,columnSpan:4},disableStreaming:{key:`disableStreaming`,label:`com_endpoint_disable_streaming_label`,labelCode:!0,description:`com_endpoint_disable_streaming`,descriptionCode:!0,type:`boolean`,default:!1,component:`switch`,optionType:`model`,showDefault:!1,columnSpan:2}},X={maxOutputTokens:{key:`maxOutputTokens`,label:`com_endpoint_max_output_tokens`,labelCode:!0,type:`number`,component:`input`,description:`com_endpoint_anthropic_maxoutputtokens`,descriptionCode:!0,placeholder:`com_nav_theme_system`,placeholderCode:!0,range:{min:E.maxOutputTokens.min,max:E.maxOutputTokens.max,step:E.maxOutputTokens.step},optionType:`model`,columnSpan:2},temperature:q(K.temperature,{default:E.temperature.default,range:{min:E.temperature.min,max:E.temperature.max,step:E.temperature.step}}),topP:q(K.topP,{default:E.topP.default,range:{min:E.topP.min,max:E.topP.max,step:E.topP.step}}),topK:{key:`topK`,label:`com_endpoint_top_k`,labelCode:!0,description:`com_endpoint_anthropic_topk`,descriptionCode:!0,type:`number`,default:E.topK.default,range:{min:E.topK.min,max:E.topK.max,step:E.topK.step},component:`slider`,optionType:`model`,columnSpan:4},promptCache:{key:`promptCache`,label:`com_endpoint_prompt_cache`,labelCode:!0,description:`com_endpoint_anthropic_prompt_cache`,descriptionCode:!0,type:`boolean`,default:E.promptCache.default,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},promptCacheTtl:{key:`promptCacheTtl`,label:`com_endpoint_prompt_cache_ttl`,labelCode:!0,description:`com_endpoint_anthropic_prompt_cache_ttl`,descriptionCode:!0,type:`enum`,default:E.promptCacheTtl.default,options:[`5m`,`1h`],component:`combobox`,optionType:`conversation`,showDefault:!1,selectPlaceholder:`com_endpoint_prompt_cache_ttl_default`,selectPlaceholderCode:!0,columnSpan:2},thinking:{key:`thinking`,label:`com_endpoint_thinking`,labelCode:!0,description:`com_endpoint_anthropic_thinking`,descriptionCode:!0,type:`boolean`,default:E.thinking.default,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},thinkingBudget:{key:`thinkingBudget`,label:`com_endpoint_thinking_budget`,labelCode:!0,description:`com_endpoint_anthropic_thinking_budget`,descriptionCode:!0,type:`number`,component:`input`,default:E.thinkingBudget.default,range:{min:E.thinkingBudget.min,max:E.thinkingBudget.max,step:E.thinkingBudget.step},optionType:`conversation`,columnSpan:2},web_search:{key:`web_search`,label:`com_ui_web_search`,labelCode:!0,description:`com_endpoint_anthropic_use_web_search`,descriptionCode:!0,type:`boolean`,default:E.web_search.default,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},effort:{key:`effort`,label:`com_endpoint_effort`,labelCode:!0,description:`com_endpoint_anthropic_effort`,descriptionCode:!0,type:`enum`,default:E.effort.default,component:`slider`,options:E.effort.options,enumMappings:{"":`com_ui_auto`,low:`com_ui_low`,medium:`com_ui_medium`,high:`com_ui_high`,xhigh:`com_ui_xhigh`,max:`com_ui_max`},optionType:`model`,columnSpan:4},thinkingDisplay:{key:`thinkingDisplay`,label:`com_endpoint_anthropic_thinking_display`,labelCode:!0,description:`com_endpoint_anthropic_thinking_display_desc`,descriptionCode:!0,type:`enum`,default:E.thinkingDisplay.default,component:`slider`,options:E.thinkingDisplay.options,enumMappings:{auto:`com_ui_auto`,summarized:`com_ui_summarized`,omitted:`com_ui_omitted`},optionType:`model`,columnSpan:4}},Z={system:{key:`system`,label:`com_endpoint_prompt_prefix`,labelCode:!0,type:`string`,default:``,component:`textarea`,placeholder:`com_endpoint_openai_prompt_prefix_placeholder`,placeholderCode:!0,optionType:`model`},region:{key:`region`,type:`string`,label:`com_ui_region`,labelCode:!0,component:`combobox`,optionType:`conversation`,selectPlaceholder:`com_ui_select_region`,searchPlaceholder:`com_ui_select_search_region`,searchPlaceholderCode:!0,selectPlaceholderCode:!0,columnSpan:2},maxTokens:{key:`maxTokens`,label:`com_endpoint_max_output_tokens`,labelCode:!0,type:`number`,component:`input`,description:`com_endpoint_anthropic_maxoutputtokens`,descriptionCode:!0,placeholder:`com_nav_theme_system`,placeholderCode:!0,optionType:`model`,columnSpan:2},temperature:q(K.temperature,{default:1,range:{min:0,max:1,step:.01}}),topK:q(X.topK,{range:{min:0,max:500,step:1}}),topP:q(K.topP,{default:.999,range:{min:0,max:1,step:.01}}),promptCache:{key:`promptCache`,label:`com_endpoint_prompt_cache`,labelCode:!0,type:`boolean`,description:`com_endpoint_anthropic_prompt_cache`,descriptionCode:!0,default:!0,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},promptCacheTtl:{key:`promptCacheTtl`,label:`com_endpoint_prompt_cache_ttl`,labelCode:!0,description:`com_endpoint_anthropic_prompt_cache_ttl`,descriptionCode:!0,type:`enum`,default:void 0,options:[`5m`,`1h`],component:`combobox`,optionType:`conversation`,showDefault:!1,selectPlaceholder:`com_endpoint_prompt_cache_ttl_default`,selectPlaceholderCode:!0,columnSpan:2},reasoning_effort:{key:`reasoning_effort`,label:`com_endpoint_reasoning_effort`,labelCode:!0,description:`com_endpoint_bedrock_reasoning_effort`,descriptionCode:!0,type:`enum`,default:``,component:`slider`,options:[``,`low`,`medium`,`high`],enumMappings:{"":`com_ui_off`,low:`com_ui_low`,medium:`com_ui_medium`,high:`com_ui_high`},optionType:`model`,columnSpan:4}},ah={temperature:q(K.temperature,{default:.7,range:{min:0,max:1,step:.01}}),topP:q(K.topP,{range:{min:0,max:1,step:.01}})},oh={temperature:q(K.temperature,{default:.3,range:{min:0,max:1,step:.01}}),topP:q(K.topP,{default:.75,range:{min:.01,max:.99,step:.01}})},Q={temperature:q(K.temperature,{default:.5,range:{min:0,max:1,step:.01}}),topP:q(K.topP,{default:.9,range:{min:0,max:1,step:.01}})},$={temperature:q(K.temperature,{default:T.temperature.default,range:{min:T.temperature.min,max:T.temperature.max,step:T.temperature.step}}),topP:q(K.topP,{default:T.topP.default,range:{min:T.topP.min,max:T.topP.max,step:T.topP.step}}),topK:{key:`topK`,label:`com_endpoint_top_k`,labelCode:!0,description:`com_endpoint_google_topk`,descriptionCode:!0,type:`number`,default:T.topK.default,range:{min:T.topK.min,max:T.topK.max,step:T.topK.step},component:`slider`,optionType:`model`,columnSpan:4},maxOutputTokens:{key:`maxOutputTokens`,label:`com_endpoint_max_output_tokens`,labelCode:!0,type:`number`,component:`input`,description:`com_endpoint_google_maxoutputtokens`,descriptionCode:!0,placeholder:`com_nav_theme_system`,placeholderCode:!0,default:T.maxOutputTokens.default,range:{min:T.maxOutputTokens.min,max:T.maxOutputTokens.max,step:T.maxOutputTokens.step},optionType:`model`,columnSpan:2},thinking:{key:`thinking`,label:`com_endpoint_thinking`,labelCode:!0,description:`com_endpoint_google_thinking`,descriptionCode:!0,type:`boolean`,default:T.thinking.default,component:`switch`,optionType:`conversation`,showDefault:!1,columnSpan:2},thinkingBudget:{key:`thinkingBudget`,label:`com_endpoint_thinking_budget`,labelCode:!0,description:`com_endpoint_google_thinking_budget`,descriptionCode:!0,placeholder:`com_ui_auto`,placeholderCode:!0,type:`number`,component:`input`,range:{min:T.thinkingBudget.min,max:T.thinkingBudget.max,step:T.thinkingBudget.step},optionType:`conversation`,columnSpan:2},thinkingLevel:{key:`thinkingLevel`,label:`com_endpoint_thinking_level`,labelCode:!0,description:`com_endpoint_google_thinking_level`,descriptionCode:!0,type:`enum`,default:``,component:`slider`,options:[``,`minimal`,`low`,`medium`,`high`],enumMappings:{"":`com_ui_auto`,minimal:`com_ui_minimal`,low:`com_ui_low`,medium:`com_ui_medium`,high:`com_ui_high`},optionType:`conversation`,columnSpan:4},web_search:{key:`web_search`,label:`com_endpoint_use_search_grounding`,labelCode:!0,description:`com_endpoint_google_use_search_grounding`,descriptionCode:!0,type:`boolean`,default:!1,component:`switch`,optionType:`model`,showDefault:!1,columnSpan:2},url_context:{key:`url_context`,label:`com_endpoint_use_url_context`,labelCode:!0,description:`com_endpoint_google_use_url_context`,descriptionCode:!0,type:`boolean`,default:!1,component:`switch`,optionType:`model`,showDefault:!1,columnSpan:2}},sh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,$.maxOutputTokens,$.temperature,$.topP,$.topK,J.resendFiles,$.thinking,$.thinkingBudget,$.thinkingLevel,$.web_search,$.url_context,J.fileTokenLimit],ch=[K.model,J.modelLabel,J.promptPrefix],lh=[J.maxContextTokens,$.maxOutputTokens,$.temperature,$.topP,$.topK,J.resendFiles,$.thinking,$.thinkingBudget,$.thinkingLevel,$.web_search,$.url_context,J.fileTokenLimit],uh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,Y.max_tokens,Y.temperature,Y.top_p,Y.frequency_penalty,Y.presence_penalty,K.stop,J.resendFiles,K.imageDetail,Y.web_search,Y.reasoning_effort,Y.useResponsesApi,Y.reasoning_summary,Y.verbosity,Y.disableStreaming,J.fileTokenLimit],dh=[...uh,X.promptCache,X.promptCacheTtl],fh=[K.model,J.modelLabel,J.promptPrefix],ph=[J.maxContextTokens,Y.max_tokens,Y.temperature,Y.top_p,Y.frequency_penalty,Y.presence_penalty,K.stop,J.resendFiles,K.imageDetail,Y.reasoning_effort,Y.reasoning_summary,Y.verbosity,Y.useResponsesApi,Y.web_search,Y.disableStreaming,J.fileTokenLimit],mh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,X.maxOutputTokens,X.temperature,X.topP,X.topK,J.resendFiles,X.promptCache,X.promptCacheTtl,X.thinking,X.thinkingBudget,X.effort,X.thinkingDisplay,X.web_search,J.fileTokenLimit],hh=[K.model,J.modelLabel,J.promptPrefix],gh=[J.maxContextTokens,X.maxOutputTokens,X.temperature,X.topP,X.topK,J.resendFiles,X.promptCache,X.promptCacheTtl,X.thinking,X.thinkingBudget,X.effort,X.thinkingDisplay,X.web_search,J.fileTokenLimit],_h=[J.modelLabel,Z.system,J.maxContextTokens,Z.maxTokens,Z.temperature,Z.topP,Z.topK,K.stop,J.resendFiles,Z.region,Z.promptCache,Z.promptCacheTtl,X.thinking,X.thinkingBudget,X.effort,X.thinkingDisplay,J.fileTokenLimit],vh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,Z.maxTokens,ah.temperature,ah.topP,J.resendFiles,Z.region,J.fileTokenLimit],yh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,Z.maxTokens,oh.temperature,oh.topP,J.resendFiles,Z.region,J.fileTokenLimit],bh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,Q.temperature,Q.topP,J.resendFiles,Z.region,Z.promptCache,Z.promptCacheTtl,J.fileTokenLimit],xh=[K.model,J.modelLabel,Z.system,K.stop],Sh=[J.maxContextTokens,Z.maxTokens,Z.temperature,Z.topP,Z.topK,J.resendFiles,Z.region,Z.promptCache,Z.promptCacheTtl,X.thinking,X.thinkingBudget,X.effort,X.thinkingDisplay,J.fileTokenLimit],Ch=[K.model,J.modelLabel,J.promptPrefix],wh=[J.maxContextTokens,Z.maxTokens,ah.temperature,ah.topP,J.resendFiles,Z.region,J.fileTokenLimit],Th=[K.model,J.modelLabel,J.promptPrefix],Eh=[J.maxContextTokens,Z.maxTokens,oh.temperature,oh.topP,J.resendFiles,Z.region,J.fileTokenLimit],Dh=[K.model,J.modelLabel,J.promptPrefix],Oh=[J.maxContextTokens,Q.temperature,Q.topP,J.resendFiles,Z.region,Z.promptCache,Z.promptCacheTtl,J.fileTokenLimit],kh=[J.modelLabel,J.promptPrefix,J.maxContextTokens,Q.temperature,Q.topP,J.resendFiles,Z.region,Z.reasoning_effort,J.fileTokenLimit],Ah=[K.model,J.modelLabel,J.promptPrefix],jh=[J.maxContextTokens,Q.temperature,Q.topP,J.resendFiles,Z.region,Z.reasoning_effort,J.fileTokenLimit],Mh=[J.modelLabel,Z.system,J.maxContextTokens,q(Z.maxTokens,{default:16384}),Z.temperature,Z.topP,K.stop,J.resendFiles,Z.region,Z.reasoning_effort,J.fileTokenLimit],Nh=[K.model,J.modelLabel,Z.system,K.stop],Ph=[J.maxContextTokens,q(Z.maxTokens,{default:16384}),Z.temperature,Z.topP,J.resendFiles,Z.region,Z.reasoning_effort,J.fileTokenLimit],Fh={openAI:uh,azureOpenAI:uh,custom:uh,openrouter:dh,anthropic:mh,"bedrock-anthropic":_h,"bedrock-mistral":vh,"bedrock-cohere":yh,"bedrock-meta":bh,"bedrock-ai21":bh,"bedrock-amazon":bh,"bedrock-deepseek":bh,"bedrock-moonshot":Mh,"bedrock-moonshotai":Mh,"bedrock-openai":bh,"bedrock-zai":kh,google:sh},Ih={col1:fh,col2:ph},Lh={col1:Dh,col2:Oh},Rh={openAI:Ih,azureOpenAI:Ih,custom:Ih,openrouter:{col1:fh,col2:[...ph,X.promptCache,X.promptCacheTtl]},anthropic:{col1:hh,col2:gh},"bedrock-anthropic":{col1:xh,col2:Sh},"bedrock-mistral":{col1:Ch,col2:wh},"bedrock-cohere":{col1:Th,col2:Eh},"bedrock-meta":Lh,"bedrock-ai21":Lh,"bedrock-amazon":Lh,"bedrock-deepseek":Lh,"bedrock-moonshot":{col1:Nh,col2:Ph},"bedrock-moonshotai":{col1:Nh,col2:Ph},"bedrock-openai":Lh,"bedrock-zai":{col1:Ah,col2:jh},google:{col1:ch,col2:lh}},zh=Object.entries(Rh).reduce((e,[t,n])=>(n&&(e[t]=n.col2),e),{});function Bh(e,t,n){return t!==`google`||!n?e:e.map(e=>e.key===`maxOutputTokens`?{...e,default:T.maxOutputTokens.reset(n)}:e)}export{uc as $,ld as $n,Ds as $t,wp as A,zs as An,As as At,hm as B,Zc as Bn,Ao as Bt,Bm as C,Fe as Cn,Ja as Ct,Fh as D,Rr as Dn,Se as Dt,th as E,An as En,Sa as Et,sp as F,kl as Fn,va as Ft,wo as G,Zs as Gn,De as Gt,Ep as H,Of as Hn,ct as Ht,cp as I,G as In,Ju as It,ba as J,kt as Jn,qa as Jt,Gs as K,Qt as Kn,hl as Kt,Mm as L,Al as Ln,ml as Lt,Dm as M,zr as Mn,rn as Mt,Rh as N,Fl as Nn,Hr as Nt,yp as O,bn as On,Us as Ot,ym as P,A as Pn,Vl as Pt,qs as Q,gf as Qn,Nf as Qt,Sp as R,$s as Rn,_l as Rt,Tp as S,nn as Sn,Ks as St,jm as T,He as Tn,Hs as Tt,nh as U,fc as Un,To as Ut,Nm as V,Xc as Vn,lt as Vt,ic as W,Zn as Wn,ks as Wt,Co as X,Nt as Xn,kf as Xt,xa as Y,jt as Yn,N as Yt,Wt as Z,be as Zn,pl as Zt,ih as _,Ls as _n,fs as _t,vm as a,Kl as an,_a as at,pp as b,Ve as bn,ls as bt,ap as c,ze as cn,Vs as ct,ip as d,xe as dn,dc as dt,Wu as en,ud as er,Ae as et,op as f,pc as fn,Kt as ft,Op as g,vn as gn,lc as gt,Bh as h,Bs as hn,je as ht,gm as i,jn as in,Dl as ir,ya as it,bp as j,El as jn,I as jt,mp as k,Mn as kn,we as kt,rp as l,cl as ln,Os as lt,Dp as m,en as mn,tc as mt,np as n,Mf as nn,fl as nr,Rs as nt,Um as o,Zt as on,Ys as ot,zh as p,cc as pn,rc as pt,Oe as q,Mt as qn,an as qt,Hm as r,Qs as rn,Pl as rr,Ws as rt,Wm as s,Af as sn,ut as st,kp as t,ec as tn,jf as tr,Ce as tt,Im as u,al as un,Js as ut,Lf as v,Pe as vn,nc as vt,Om as w,dt as wn,Xs as wt,_p as x,Be as xn,us as xt,Cp as y,Ee as yn,ds as yt,Vm as z,yn as zn,Yc as zt};