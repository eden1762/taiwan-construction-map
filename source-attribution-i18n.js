const SOURCE_LABELS_EN = {
  '國土測繪圖資服務雲': 'National Land Surveying and Mapping Center map service',
  '國土測繪圖資服務雲（地籍僅供參考）': 'National Land Surveying and Mapping Center; cadastre layer for reference only'
};

function isEnglishMode() {
  return document.documentElement.lang === 'en';
}

function localizeMapAttribution() {
  if (!isEnglishMode()) return;
  document.querySelectorAll('.map-attribution a').forEach(link => {
    const text = link.textContent.trim();
    link.textContent = SOURCE_LABELS_EN[text] || text;
  });
}

localizeMapAttribution();
new MutationObserver(() => window.requestAnimationFrame(localizeMapAttribution)).observe(document.documentElement, {
  subtree: true,
  childList: true,
  characterData: true,
  attributes: true,
  attributeFilter: ['lang', 'class']
});
