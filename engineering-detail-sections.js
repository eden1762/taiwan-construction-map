(() => {
  const SELECTOR = '.mvp-project-card';
  const MARK = 'detailSectionsReady';

  const LABELS = {
    zh: {
      title: '工程詳情分區',
      summary: '展開工程詳情',
      verified: '待補資料',
      sections: [
        ['基本資料', ['工程名稱', '類型', '狀態', '更新日']],
        ['位置範圍', ['地點', '地圖標示方式']],
        ['工程內容', ['主要工程內容']],
        ['發包與廠商', ['甲方', '乙方']],
        ['金額成本', ['金額']],
        ['時間期程', ['開工日', '預計完工日']],
        ['施工進度', ['目前進度']],
        ['審查法規', ['環評、都計、建管或採購程序']],
        ['民眾資訊', ['資料來源與公開查詢']]
      ]
    },
    en: {
      title: 'Project detail sections',
      summary: 'Open project details',
      verified: 'To be verified',
      sections: [
        ['Basic facts', ['Project name', 'Type', 'Status', 'Updated']],
        ['Location and footprint', ['Place', 'Map mark']],
        ['Scope of works', ['Main scope']],
        ['Owner and contractor', ['Owner', 'Contractor']],
        ['Budget and cost', ['Budget']],
        ['Schedule', ['Start', 'Planned finish']],
        ['Construction progress', ['Current progress']],
        ['Review and permits', ['EIA, planning, permit, or procurement step']],
        ['Public information', ['Source and public lookup']]
      ]
    }
  };

  const norm = value => String(value || '').replace(/\s+/g, '').replace(/[：:]/g, '').trim().toLowerCase();
  const text = node => String(node?.textContent || '').trim();
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'zh';
  const safe = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const collectRows = card => {
    const data = {};
    card.querySelectorAll('dl > div').forEach(row => {
      const key = norm(text(row.querySelector('dt')));
      const value = text(row.querySelector('dd'));
      if (key) data[key] = value;
    });
    const badges = [...card.querySelectorAll('.badge')].map(text).filter(Boolean);
    const source = card.querySelector('.detail-actions a');
    return { data, badges, sourceText: text(source), sourceUrl: source?.href || '' };
  };

  const findValue = (rows, labels, fallback = '') => {
    const keys = labels.map(norm);
    for (const key of keys) {
      if (rows.data[key]) return rows.data[key];
    }
    return fallback;
  };

  const buildValues = (card, rows) => {
    const projectName = text(card.querySelector('h3'));
    const place = text(card.querySelector('h3 + p'));
    const type = rows.badges[0] || '';
    const status = rows.badges[1] || '';
    const sourceLine = rows.sourceText ? `${rows.sourceText}` : '';
    return {
      zh: {
        '工程名稱': projectName,
        '類型': type,
        '狀態': status,
        '更新日': findValue(rows, ['更新日', 'Updated']),
        '地點': place || findValue(rows, ['地點', 'Place']),
        '地圖標示方式': findValue(rows, ['標示方式', 'Map mark']),
        '主要工程內容': rows.verified,
        '甲方': findValue(rows, ['甲方', 'Owner']),
        '乙方': findValue(rows, ['乙方', 'Contractor']),
        '金額': findValue(rows, ['金額', 'Budget']),
        '開工日': findValue(rows, ['開工日', 'Start']),
        '預計完工日': findValue(rows, ['預計完工日', 'Planned finish']),
        '目前進度': status,
        '環評、都計、建管或採購程序': rows.verified,
        '資料來源與公開查詢': sourceLine || rows.verified
      },
      en: {
        'Project name': projectName,
        'Type': type,
        'Status': status,
        'Updated': findValue(rows, ['更新日', 'Updated']),
        'Place': place || findValue(rows, ['地點', 'Place']),
        'Map mark': findValue(rows, ['標示方式', 'Map mark']),
        'Main scope': rows.verified,
        'Owner': findValue(rows, ['甲方', 'Owner']),
        'Contractor': findValue(rows, ['乙方', 'Contractor']),
        'Budget': findValue(rows, ['金額', 'Budget']),
        'Start': findValue(rows, ['開工日', 'Start']),
        'Planned finish': findValue(rows, ['預計完工日', 'Planned finish']),
        'Current progress': status,
        'EIA, planning, permit, or procurement step': rows.verified,
        'Source and public lookup': sourceLine || rows.verified
      }
    };
  };

  const enhanceCard = card => {
    if (!card || card.dataset[MARK] === '1') return;
    card.dataset[MARK] = '1';

    const currentLang = lang();
    const label = LABELS[currentLang];
    const rows = collectRows(card);
    rows.verified = label.verified;
    const values = buildValues(card, rows)[currentLang];

    const details = document.createElement('details');
    details.className = 'engineering-detail-sections';
    details.innerHTML = `<summary>${safe(label.summary)}</summary><div class="detail-section-grid">${label.sections.map(([sectionTitle, items]) => `<section class="detail-section"><h4>${safe(sectionTitle)}</h4>${items.map(item => `<p><span>${safe(item)}</span><b>${safe(values[item] || label.verified)}</b></p>`).join('')}</section>`).join('')}</div>`;

    const action = card.querySelector('.detail-actions');
    if (action) action.before(details);
    else card.append(details);
  };

  const scan = () => document.querySelectorAll(SELECTOR).forEach(enhanceCard);
  const injectStyle = () => {
    if (document.getElementById('engineering-detail-sections-style')) return;
    const style = document.createElement('style');
    style.id = 'engineering-detail-sections-style';
    style.textContent = `.engineering-detail-sections{margin:14px 0;border:1px solid rgba(15,42,68,.1);border-radius:18px;background:linear-gradient(135deg,#f8fbff,#fff);overflow:hidden}.engineering-detail-sections summary{cursor:pointer;min-height:44px;padding:12px 14px;font-weight:950;color:#12314a;list-style:none}.engineering-detail-sections summary::-webkit-details-marker{display:none}.engineering-detail-sections summary::after{content:'＋';float:right}.engineering-detail-sections[open] summary::after{content:'－'}.detail-section-grid{display:grid;gap:10px;padding:0 12px 12px}.detail-section{padding:12px;border-radius:15px;background:rgba(255,255,255,.9);border:1px solid rgba(15,42,68,.08)}.detail-section h4{margin:0 0 8px;font-size:13px;color:#0f2b44}.detail-section p{display:grid;grid-template-columns:108px minmax(0,1fr);gap:8px;margin:6px 0;font-size:12px;line-height:1.45}.detail-section span{color:#6b7d8f}.detail-section b{font-weight:850;color:#172d40;word-break:break-word}@media(max-width:900px){.detail-section p{grid-template-columns:94px minmax(0,1fr)}}`;
    document.head.append(style);
  };

  const boot = () => {
    injectStyle();
    scan();
    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(() => {
      document.querySelectorAll(`${SELECTOR}[data-${MARK.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}="1"]`).forEach(card => {
        card.dataset[MARK] = '';
        card.querySelector('.engineering-detail-sections')?.remove();
      });
      scan();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
