(() => {
  const STATUS_VALUE = '招標準備';
  const LABELS = {
    zh: '招標準備',
    en: 'Pre-tender'
  };

  const getLang = () => document.documentElement.lang === 'en' ? 'en' : 'zh';
  const getLabel = () => LABELS[getLang()] || LABELS.zh;

  const ensurePreTenderOption = () => {
    const select = document.querySelector('#statusFilter');
    if (!select) return;

    let option = [...select.options].find(item => item.value === STATUS_VALUE);
    if (!option) {
      option = document.createElement('option');
      option.value = STATUS_VALUE;
      const tendering = [...select.options].find(item => item.value === '招標中');
      if (tendering?.nextSibling) select.insertBefore(option, tendering.nextSibling);
      else if (tendering) tendering.after(option);
      else select.append(option);
    }
    option.textContent = getLabel();
  };

  const boot = () => {
    ensurePreTenderOption();
    const select = document.querySelector('#statusFilter');
    if (select) {
      new MutationObserver(() => ensurePreTenderOption()).observe(select, { childList: true });
    }
    new MutationObserver(() => ensurePreTenderOption()).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
