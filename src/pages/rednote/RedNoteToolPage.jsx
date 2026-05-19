import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import demoCollection from '../../data/rednote/demoCollection.json';
import '../../styles/rednote-tool.css';

const tabs = [
  { key: 'search', label: '笔记浏览' },
  { key: 'collections', label: '采集任务' },
  { key: 'export', label: '导出' },
];

function formatNumber(value = 0) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  return String(value);
}

function noteText(note) {
  return [
    note.title,
    note.desc,
    note.author?.nickname,
    note.sourceQuery,
    ...(note.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function downloadText(filename, content, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildMarkdown(collection, notes) {
  const lines = [
    `# ${collection.topic}`,
    '',
    `采集时间：${new Date(collection.createdAt).toLocaleString('zh-CN')}`,
    `笔记数量：${notes.length}`,
    '',
  ];

  notes.forEach((note, index) => {
    lines.push(
      `## ${index + 1}. ${note.title || '无标题'}`,
      '',
      `作者：${note.author?.nickname || '未知'}`,
      `点赞：${note.interactions?.likes || 0} / 评论：${note.interactions?.comments || 0} / 收藏：${note.interactions?.collects || 0}`,
      `发布时间：${note.publishTime || '-'}`,
      `采集词：${note.sourceQuery || '-'}`,
      `原帖链接：${getNoteUrl(note) || '-'}`,
      '',
    );
  });

  return lines.join('\n');
}

function getNoteUrl(note) {
  return note.noteUrl || note.detail?.context?.url || '';
}

function RedNoteToolPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [query, setQuery] = useState('人生管理');
  const [sortKey, setSortKey] = useState('likes');
  const [selectedNote, setSelectedNote] = useState(null);

  const notes = demoCollection.notes || [];

  const filteredNotes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const matched = keyword
      ? notes.filter((note) => noteText(note).includes(keyword))
      : notes;

    return [...matched].sort(
      (a, b) => (b.interactions?.[sortKey] || 0) - (a.interactions?.[sortKey] || 0),
    );
  }, [notes, query, sortKey]);

  const totals = useMemo(
    () =>
      filteredNotes.reduce(
        (acc, note) => ({
          likes: acc.likes + (note.interactions?.likes || 0),
          comments: acc.comments + (note.interactions?.comments || 0),
          collects: acc.collects + (note.interactions?.collects || 0),
        }),
        { likes: 0, comments: 0, collects: 0 },
      ),
    [filteredNotes],
  );

  const sourceQueries = useMemo(() => {
    const seen = new Map();
    notes.forEach((note) => {
      const q = note.sourceQuery;
      if (!q) return;
      seen.set(q, (seen.get(q) || 0) + 1);
    });
    return [...seen.entries()].sort((a, b) => b[1] - a[1]);
  }, [notes]);

  const exportJson = () => {
    downloadText(
      `${demoCollection.collectionId}.json`,
      JSON.stringify({ ...demoCollection, notes: filteredNotes }, null, 2),
      'application/json',
    );
  };

  const exportMarkdown = () => {
    downloadText(
      `${demoCollection.topic}.md`,
      buildMarkdown(demoCollection, filteredNotes),
      'text/markdown',
    );
  };

  const collectionTime = new Date(demoCollection.createdAt).toLocaleString('zh-CN');

  return (
    <main className="rednote-tool">
      <header className="rednote-tool__header">
        <Link className="rednote-tool__back" to="/works">
          ← 返回作品
        </Link>
        <div className="rednote-tool__header-body">
          <p className="rednote-tool__eyebrow">RedNote Collector · 演示快照</p>
          <h1>小红书内容采集与整理工具</h1>
          <p>
            这是 rednote-collector 一次真实采集任务的本地快照——主题《{demoCollection.topic}》，
            共 {notes.length} 条笔记元数据已随站点打包，可在线感受筛选、浏览与导出三步流程。
          </p>
          <p className="rednote-tool__hint">
            搜索采集、登录态接入、笔记正文与评论抓取这些需要后端的能力，在本地运行
            <code> rednote-collector </code>
            时启用；此页不连接任何线上接口，所有操作都在浏览器内完成。
          </p>
          <ul className="rednote-tool__meta-row">
            <li>
              <span>采集时间</span>
              <strong>{collectionTime}</strong>
            </li>
            <li>
              <span>成功 / 失败</span>
              <strong>
                {demoCollection.stats?.success ?? notes.length} / {demoCollection.stats?.fail ?? 0}
              </strong>
            </li>
            <li>
              <span>采集词数量</span>
              <strong>{sourceQueries.length}</strong>
            </li>
          </ul>
        </div>
      </header>

      <nav className="rednote-tool__tabs" aria-label="工具导航">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="rednote-tool__metrics" aria-label="数据概览">
        <article>
          <span>当前筛选</span>
          <strong>
            {filteredNotes.length}
            <em> / {notes.length} 条</em>
          </strong>
        </article>
        <article>
          <span>总点赞</span>
          <strong>{formatNumber(totals.likes)}</strong>
        </article>
        <article>
          <span>总评论</span>
          <strong>{formatNumber(totals.comments)}</strong>
        </article>
        <article>
          <span>总收藏</span>
          <strong>{formatNumber(totals.collects)}</strong>
        </article>
      </section>

      {activeTab === 'search' && (
        <section className="rednote-tool__panel">
          <div className="rednote-tool__panel-intro">
            <h2>在采集结果里筛选</h2>
            <p>
              输入关键词在 {notes.length} 条已采集笔记中匹配 <em>标题 / 作者 / 采集词</em>，
              结果按所选互动维度排序。
            </p>
          </div>
          <div className="rednote-tool__controls">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="关键词，例如：人生管理、Notion、自律"
            />
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="likes">按点赞排序</option>
              <option value="comments">按评论排序</option>
              <option value="collects">按收藏排序</option>
            </select>
          </div>
          <NoteGrid notes={filteredNotes} onOpen={setSelectedNote} />
        </section>
      )}

      {activeTab === 'collections' && (
        <section className="rednote-tool__panel">
          <div className="rednote-tool__panel-intro">
            <h2>采集任务概览</h2>
            <p>
              rednote-collector 真实运行时，每一次「主题 + 多关键词」的批量采集都会沉淀成这样一个 collection 文件。
            </p>
          </div>
          <div className="rednote-tool__collection">
            <div>
              <p className="rednote-tool__eyebrow">Collection</p>
              <h3>{demoCollection.topic}</h3>
              <p>
                {collectionTime} · 成功 {demoCollection.stats?.success ?? notes.length} 条 · 失败{' '}
                {demoCollection.stats?.fail ?? 0} 条
              </p>
            </div>
            <button type="button" onClick={() => setActiveTab('export')}>
              去导出
            </button>
          </div>
          <div className="rednote-tool__source-queries">
            <p className="rednote-tool__eyebrow">本任务包含的采集词</p>
            <div className="rednote-tool__chip-list">
              {sourceQueries.map(([q, count]) => (
                <span key={q} className="rednote-tool__chip">
                  {q}
                  <em>{count}</em>
                </span>
              ))}
            </div>
          </div>
          <NoteTable notes={filteredNotes} onOpen={setSelectedNote} />
        </section>
      )}

      {activeTab === 'export' && (
        <section className="rednote-tool__panel">
          <div className="rednote-tool__panel-intro">
            <h2>导出当前筛选结果</h2>
            <p>
              将筛选后的 {filteredNotes.length} 条笔记导出为 Markdown 或 JSON，方便继续做报告、表格或二次分析。
              本地运行时还能直接拉取最新数据后再导出。
            </p>
          </div>
          <div className="rednote-tool__export">
            <div>
              <p className="rednote-tool__eyebrow">Export</p>
              <h3>
                {filteredNotes.length} 条 · 已按
                {sortKey === 'likes' ? '点赞' : sortKey === 'comments' ? '评论' : '收藏'}
                排序
              </h3>
              <p>导出内容包含标题、作者、互动量、采集词与原帖链接。</p>
            </div>
            <div className="rednote-tool__export-actions">
              <button type="button" onClick={exportMarkdown} disabled={filteredNotes.length === 0}>
                导出 Markdown
              </button>
              <button type="button" onClick={exportJson} disabled={filteredNotes.length === 0}>
                导出 JSON
              </button>
            </div>
          </div>
        </section>
      )}

      {selectedNote && (
        <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </main>
  );
}

function NoteCover({ note, index }) {
  const accentIndex = Math.abs(hashCode(note.sourceQuery || note.noteId || '')) % COVER_ACCENTS.length;
  const accent = COVER_ACCENTS[accentIndex];
  return (
    <div className="rednote-tool__cover" style={{ background: accent.background }}>
      <span className="rednote-tool__cover-index" style={{ color: accent.text }}>
        #{String(index + 1).padStart(2, '0')}
      </span>
      <span className="rednote-tool__cover-source" style={{ color: accent.text }}>
        {note.sourceQuery || '采集样本'}
      </span>
    </div>
  );
}

function NoteGrid({ notes, onOpen }) {
  if (notes.length === 0) {
    return <p className="rednote-tool__empty">没有匹配结果，换个关键词试试。</p>;
  }

  return (
    <div className="rednote-tool__grid">
      {notes.map((note, index) => (
        <article key={note.noteId} className="rednote-tool__card">
          <NoteCover note={note} index={index} />
          <div className="rednote-tool__card-body">
            <h3>{note.title || '无标题'}</h3>
            <p className="rednote-tool__card-author">{note.author?.nickname || '未知作者'}</p>
            <p className="rednote-tool__card-stats">
              <span>♥ {formatNumber(note.interactions?.likes || 0)}</span>
              <span>💬 {formatNumber(note.interactions?.comments || 0)}</span>
              <span>★ {formatNumber(note.interactions?.collects || 0)}</span>
            </p>
            <button type="button" onClick={() => onOpen(note)}>
              查看详情
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function NoteTable({ notes, onOpen }) {
  if (notes.length === 0) {
    return <p className="rednote-tool__empty">当前筛选下没有结果。</p>;
  }

  return (
    <div className="rednote-tool__table-wrap">
      <table className="rednote-tool__table">
        <thead>
          <tr>
            <th>标题</th>
            <th>作者</th>
            <th>采集词</th>
            <th>点赞</th>
            <th>评论</th>
            <th>收藏</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.noteId} onClick={() => onOpen(note)}>
              <td>{note.title || '无标题'}</td>
              <td>{note.author?.nickname || '未知'}</td>
              <td className="rednote-tool__table-source">{note.sourceQuery || '-'}</td>
              <td>{formatNumber(note.interactions?.likes || 0)}</td>
              <td>{formatNumber(note.interactions?.comments || 0)}</td>
              <td>{formatNumber(note.interactions?.collects || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoteModal({ note, onClose }) {
  const externalUrl = getNoteUrl(note);
  const detailIssue = note.detail && note.detail.success === false;
  return (
    <div className="rednote-tool__modal" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="rednote-tool__modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="rednote-tool__modal-close"
          type="button"
          onClick={onClose}
          aria-label="关闭详情"
        >
          ×
        </button>
        <p className="rednote-tool__eyebrow">采集样本</p>
        <h2>{note.title || '无标题'}</h2>
        <p className="rednote-tool__modal-author">
          {note.author?.nickname || '未知作者'} · {note.publishTime || '发布时间未知'}
        </p>

        <dl className="rednote-tool__modal-meta">
          <div>
            <dt>点赞</dt>
            <dd>{formatNumber(note.interactions?.likes || 0)}</dd>
          </div>
          <div>
            <dt>评论</dt>
            <dd>{formatNumber(note.interactions?.comments || 0)}</dd>
          </div>
          <div>
            <dt>收藏</dt>
            <dd>{formatNumber(note.interactions?.collects || 0)}</dd>
          </div>
          <div>
            <dt>分享</dt>
            <dd>{formatNumber(note.interactions?.shares || 0)}</dd>
          </div>
        </dl>

        <div className="rednote-tool__modal-section">
          <p className="rednote-tool__eyebrow">采集词</p>
          <p>{note.sourceQuery || '未记录'}</p>
        </div>

        {detailIssue && (
          <p className="rednote-tool__modal-notice">
            本演示快照只携带笔记元数据，正文与评论需要在本地登录态下抓取。点击下方按钮可前往小红书查看完整内容。
          </p>
        )}

        {externalUrl ? (
          <a
            className="rednote-tool__modal-cta"
            href={externalUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            在小红书查看原帖 ↗
          </a>
        ) : (
          <span className="rednote-tool__modal-cta is-disabled">原帖链接缺失</span>
        )}
      </div>
    </div>
  );
}

const COVER_ACCENTS = [
  { background: 'linear-gradient(135deg, #ffe2d6 0%, #ffb098 100%)', text: '#7a2b13' },
  { background: 'linear-gradient(135deg, #fdf2c8 0%, #f4c062 100%)', text: '#5e3d05' },
  { background: 'linear-gradient(135deg, #dde9ff 0%, #92b3ff 100%)', text: '#1f3680' },
  { background: 'linear-gradient(135deg, #e5dcff 0%, #b39bff 100%)', text: '#3a1f80' },
  { background: 'linear-gradient(135deg, #d6f0e1 0%, #6fc99a 100%)', text: '#1b4a30' },
  { background: 'linear-gradient(135deg, #ffd9e5 0%, #ff8aa9 100%)', text: '#7a1c3c' },
];

function hashCode(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

export default RedNoteToolPage;
