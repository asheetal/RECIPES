'use strict';
const modes=['training','web','academic'];
function category(name){
 name=String(name||'').toLowerCase();
 if(/^(file_search|research_files|project_files|read_file)(?:$|_)/.test(name))return null;
 if(/research_search|verify_references|openalex|semantic_scholar|crossref|scholar|academic/.test(name))return 'academic';
 if(/web_search|websearch|internet|search_web|tavily|brave_search|searx|browse|fetch_url|scrape|crawl|search/.test(name))return 'web';
 return null;
}
function allowed(mode,name){const c=category(name);return !c||c===mode;}
const nameOf=t=>typeof t==='string'?t:t?.name||t?.function?.name||'';
module.exports={modes,category,allowed,nameOf};
