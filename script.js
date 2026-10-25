(() => {
const KEY="ourLittleMemoryJar_v3", $=id=>document.getElementById(id);
const DATA={
 star:{emoji:"⭐",title:"A little star memory",message:"A little star, holding a special memory."},
 heart:{emoji:"💖",title:"A little love note",message:"A little heart, holding a special memory."},
 rose:{emoji:"🌹",title:"A rose for you",message:"A rose to remember this beautiful moment."},
 chocolate:{emoji:"🍫",title:"A sweet memory",message:"A little sweetness, saved just for you."}
};
let items=load(),pendingType="star",selected=null,timer;
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(x))return x}catch(e){}return []}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}}
function render(){
 $("items").innerHTML="";
 items.forEach((it,i)=>{const d=DATA[it.type]||DATA.star,b=document.createElement("button");b.className="jar-item";b.type="button";b.textContent=d.emoji;b.title=it.title||d.title;b.setAttribute("aria-label",b.title);b.style.left=(it.x??(10+Math.random()*70))+"%";b.style.top=(it.y??(10+Math.random()*70))+"%";b.style.setProperty("--rotation",(it.rotate??0)+"deg");b.style.animationDelay=-(i%7)*.35+"s";b.onclick=()=>open(it);$("items").appendChild(b)});
 $("count").textContent=items.length+" "+(items.length===1?"memory":"memories")+" inside";
}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(timer);timer=setTimeout(()=>$("toast").classList.remove("show"),2600)}
function hearts(){const icons=["💖","💕","💗","❤️","✨","🌹","⭐"];for(let i=0;i<28;i++){const el=document.createElement("span");el.className="flying";el.textContent=icons[Math.floor(Math.random()*icons.length)];el.style.left=Math.random()*100+"%";el.style.setProperty("--drift",(Math.random()*180-90)+"px");el.style.animationDelay=Math.random()*.5+"s";el.style.fontSize=(18+Math.random()*22)+"px";$("hearts").appendChild(el);setTimeout(()=>el.remove(),2400)}}
function showAdd(type){pendingType=type;const d=DATA[type]||DATA.star;$("addEmoji").textContent=d.emoji;$("memoryTitle").value="";$("memoryMessage").value="";$("memoryUrl").value="";$("formError").hidden=true;$("addModal").hidden=false;setTimeout(()=>$("memoryTitle").focus(),50)}
function closeAdd(){$("addModal").hidden=true}
function saveNew(){
 const title=$("memoryTitle").value.trim(),message=$("memoryMessage").value.trim(),url=$("memoryUrl").value.trim();
 if(!/^https?:\/\/\S+/i.test(url)){$("formError").hidden=false;return}
 const d=DATA[pendingType],it={id:Date.now()+"-"+Math.random(),type:pendingType,title:title||d.title,message:message||d.message,url,x:8+Math.random()*72,y:8+Math.random()*72,rotate:Math.random()*24-12};
 items.push(it);save();render();closeAdd();hearts();toast(d.emoji+" Your memory has been added to the jar!");
}
function open(it){selected=it;$("emoji").textContent=(DATA[it.type]||DATA.star).emoji;$("title").textContent=it.title||DATA[it.type].title;$("description").textContent=it.message||DATA[it.type].message;$("openJourney").textContent=it.url?"Open this memory ♥":"No link saved";$("openJourney").disabled=!it.url;$("modal").hidden=false}
function close(){$("modal").hidden=true;selected=null}
function all(){$("emoji").textContent="💌";$("title").textContent="All our little memories";$("description").textContent=items.length?items.map((x,i)=>`${i+1}. ${(DATA[x.type]||DATA.star).emoji} ${x.title}`).join(" • "):"Your jar is empty for now. Add a star, heart, rose, or chocolate to save your first memory.";$("openJourney").textContent="Choose a treasure in the jar";$("openJourney").disabled=true;$("modal").hidden=false;selected=null}
document.querySelectorAll(".add").forEach(b=>b.addEventListener("click",()=>showAdd(b.dataset.type)));
$("addStarTop").onclick=()=>showAdd("star");$("viewAllTop").onclick=all;$("viewAll").onclick=all;
$("share").onclick=async()=>{try{if(navigator.share)await navigator.share({title:"Our Little Memory Jar ❤️",text:"A little jar full of our memories.",url:location.href});else{await navigator.clipboard.writeText(location.href);toast("Jar link copied — send it to her! ❤️")}}catch(e){toast("Copy this page URL to share your jar.")}};
$("addClose").onclick=closeAdd;$("cancelMemory").onclick=closeAdd;$("saveMemory").onclick=saveNew;$("addModal").onclick=e=>{if(e.target===$("addModal"))closeAdd()};
$("close").onclick=close;$("keep").onclick=close;$("modal").onclick=e=>{if(e.target===$("modal"))close()};
document.addEventListener("keydown",e=>{if(e.key==="Escape"){close();closeAdd()}});
$("openJourney").onclick=()=>{if(selected&&selected.url){hearts();const url=selected.url;setTimeout(()=>location.href=url,250)}else close()};
$("reset").onclick=()=>{if(confirm("Empty the jar and remove all saved memories from this browser?")){items=[];save();render();toast("Your jar is empty and ready for new memories. ❤️")}};
render();
})();