document.addEventListener("DOMContentLoaded",()=> {
  const languageButton = document.querySelector(".language-toggle");
  const translations = new Map(window.portfolioTranslations || []);
  const normalize = value => value.replace(/\s+/g, " ").trim();
  const translatedNodes = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest("script, style, pre, code, .language-toggle")) continue;
    const english = translations.get(normalize(node.nodeValue));
    if (english) {
      translatedNodes.push({node, fr: node.nodeValue, en: node.nodeValue.replace(/\S[\s\S]*\S|\S/, () => english)});
    }
  }
  const translatedAttributes = [];
  document.querySelectorAll("[alt], [aria-label], meta[name='description']").forEach(element => {
    if (element === languageButton) return;
    ["alt", "aria-label", "content"].forEach(attribute => {
      const french = element.getAttribute(attribute);
      const english = french && translations.get(normalize(french));
      if (english) translatedAttributes.push({element, attribute, fr: french, en: english});
    });
  });
  const setLanguage = language => {
    const selected = language === "en" ? "en" : "fr";
    document.documentElement.lang = selected;
    translatedNodes.forEach(entry => { entry.node.nodeValue = entry[selected]; });
    translatedAttributes.forEach(entry => entry.element.setAttribute(entry.attribute, entry[selected]));
    if (languageButton) {
      const label = selected === "fr" ? "Switch to English" : "Passer en français";
      languageButton.textContent = selected === "fr" ? "EN" : "FR";
      languageButton.lang = selected === "fr" ? "en" : "fr";
      languageButton.setAttribute("aria-label", label);
      languageButton.title = label;
    }
  };
  let savedLanguage = "fr";
  try { savedLanguage = localStorage.getItem("portfolio-language") || "fr"; } catch {}
  setLanguage(savedLanguage);
  languageButton?.addEventListener("click", () => {
    const next = document.documentElement.lang === "fr" ? "en" : "fr";
    setLanguage(next);
    try { localStorage.setItem("portfolio-language", next); } catch {}
  });

  const menu=document.querySelector(".menu-toggle"), links=document.querySelector(".nav-links");
  const closeMenu = () => {
    links?.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  };
  if (menu && links) {
    menu.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && links.classList.contains("open")) {
        closeMenu();
        menu.focus();
      }
    });
    document.addEventListener("click", event => {
      if (!menu.contains(event.target) && !links.contains(event.target)) closeMenu();
    });
    window.matchMedia("(max-width: 1050px)").addEventListener("change", closeMenu);
  }
  document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", closeMenu));

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
