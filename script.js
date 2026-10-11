document.addEventListener("DOMContentLoaded",()=> {
  const menu=document.querySelector(".menu-toggle"), links=document.querySelector(".nav-links");
  if(menu&&links){menu.addEventListener("click",()=>{const open=links.classList.toggle("open");menu.setAttribute("aria-expanded",open)})}
  document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>links?.classList.remove("open")));

  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
    const filter=btn.dataset.filter;
    document.querySelectorAll(".archive-item").forEach(item=>item.classList.toggle("hidden",filter!=="all"&&item.dataset.category!==filter));
  }));

  const space=document.querySelector("#tag-space");
  if(space){
    const original=[...space.children].map(el=>({el,x:el.style.left,y:el.style.top}));
    space.querySelectorAll("span").forEach(tag=>{
      let dragging=false,ox=0,oy=0;
      tag.addEventListener("pointerdown",e=>{dragging=true;tag.setPointerCapture(e.pointerId);const r=tag.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;tag.style.cursor="grabbing"});
      tag.addEventListener("pointermove",e=>{if(!dragging)return;const r=space.getBoundingClientRect();let x=e.clientX-r.left-ox,y=e.clientY-r.top-oy;x=Math.max(0,Math.min(x,r.width-tag.offsetWidth));y=Math.max(0,Math.min(y,r.height-tag.offsetHeight));tag.style.left=x+"px";tag.style.top=y+"px"});
      tag.addEventListener("pointerup",()=>{dragging=false;tag.style.cursor="grab"});
    });
    document.querySelector("#resetTags")?.addEventListener("click",()=>original.forEach(o=>{o.el.style.left=o.x;o.el.style.top=o.y}));
  }
});