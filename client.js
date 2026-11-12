/**
 * Browser half of the Memory plugin: a Settings → Memory page over the
 * loopback-authenticated `/dsh-memory` route registered by index.js.
 *
 * The module is plain JavaScript because it is loaded through the Harness
 * client module table; React is provided by the page. Styles use only the
 * theme aliases and are removed with the component.
 */
window.__ModuleLoader__.load({
  id: '@local/dsh-memory',
  factory(require) {
    const React = require('react')
    const { useCallback, useEffect, useMemo, useRef, useState } = React
    const h = React.createElement
    const NS = 'memory'
    const API = '/dsh-memory'

    const en = {
      nav: 'Memory',
      title: 'Memory',
      description: 'Notes the assistant keeps between chats, across workspaces and globally.',
      storage: 'Stored in {path}',
      new: 'New note',
      newIn: 'New note in {group}',
      search: 'Search notes',
      countOne: '1 note',
      countMany: '{count} notes',
      loading: 'Loading notes…',
      loadError: 'Could not load memories.',
      retry: 'Retry',
      empty: 'No notes yet',
      emptyHint: 'Ask the assistant to remember something, or create a note here.',
      noMatches: 'No notes match your search.',
      searchHint: 'Try a different word or clear the search.',
      clearSearch: 'Clear search',
      refresh: 'Refresh',
      unsaved: 'Save or cancel this note before switching.',
      duplicateTitle: 'A note with that title already exists in this scope.',
      noteNotFound: 'That note no longer exists.',
      operationFailed: 'The memory operation failed.',
      authError: 'Your session is not authorized. Reload the page and try again.',
      confirmDeleteHint: 'Press Confirm delete again to delete this note permanently.',
      global: 'Global',
      workspace: 'Workspace',
      unknownWorkspace: 'Unknown workspace',
      editorNew: 'New note',
      editorEdit: 'Edit note',
      editing: 'Editing note',
      titleLabel: 'Title',
      titlePlaceholder: 'A short, specific title',
      contentLabel: 'Note',
      contentPlaceholder: 'What should future chats know?',
      tagsLabel: 'Tags',
      tagsHint: 'Comma-separated, optional',
      scopeLabel: 'Scope',
      save: 'Save',
      saving: 'Saving…',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Confirm delete',
      deleting: 'Deleting…',
      saved: 'Memory saved.',
      deleted: 'Memory deleted.',
      titleRequired: 'A title is required.',
      contentRequired: 'A note is required.',
      saveError: 'Could not save the note.',
      deleteError: 'Could not delete the note.',
      updated: 'Updated {date}',
    }

    const zh = {
      nav: '记忆',
      title: '记忆',
      description: '助手在对话之间保存的各个工作区笔记和全局笔记。',
      storage: '存储在 {path}',
      new: '新建笔记',
      newIn: '在{group}中新建笔记',
      search: '搜索笔记',
      countOne: '1 条笔记',
      countMany: '{count} 条笔记',
      loading: '正在加载笔记…',
      loadError: '无法加载记忆。',
      retry: '重试',
      empty: '还没有笔记',
      emptyHint: '让助手记住一些内容，或在这里新建笔记。',
      noMatches: '没有匹配的笔记。',
      searchHint: '换个词试试，或清除搜索。',
      clearSearch: '清除搜索',
      refresh: '刷新',
      unsaved: '切换前请先保存或取消当前笔记。',
      duplicateTitle: '此范围中已存在同名笔记。',
      noteNotFound: '该笔记已不存在。',
      operationFailed: '记忆操作失败。',
      authError: '当前会话未授权，请刷新页面后重试。',
      confirmDeleteHint: '再次点击“确认删除”将永久删除该笔记。',
      global: '全局',
      workspace: '工作区',
      unknownWorkspace: '未知工作区',
      editorNew: '新建笔记',
      editorEdit: '编辑笔记',
      editing: '正在编辑笔记',
      titleLabel: '标题',
      titlePlaceholder: '简短、具体的标题',
      contentLabel: '笔记',
      contentPlaceholder: '未来的对话需要知道什么？',
      tagsLabel: '标签',
      tagsHint: '用逗号分隔，可选',
      scopeLabel: '范围',
      save: '保存',
      saving: '正在保存…',
      cancel: '取消',
      delete: '删除',
      confirmDelete: '确认删除',
      deleting: '正在删除…',
      saved: '记忆已保存。',
      deleted: '记忆已删除。',
      titleRequired: '标题不能为空。',
      contentRequired: '笔记内容不能为空。',
      saveError: '无法保存笔记。',
      deleteError: '无法删除笔记。',
      updated: '更新于 {date}',
    }

    const CSS = `
.dsh-memory-page {
  color: var(--dsw-alias-label-primary);
  font-size: 14px;
  line-height: 1.5;
  padding-bottom: 8px;
}
.dsh-memory-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 4px;
  margin-bottom: 10px;
}
.dsh-memory-heading { min-width: 0; }
.dsh-memory-heading h2 {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.dsh-memory-heading p {
  margin: 4px 0 0;
  max-width: 60ch;
  font-size: 13px;
  line-height: 19px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-storage {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
}
.dsh-memory-primary,
.dsh-memory-secondary,
.dsh-memory-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  box-sizing: border-box;
  font: inherit;
  font-size: 13px;
  line-height: 18px;
  cursor: pointer;
  white-space: nowrap;
}
.dsh-memory-primary {
  color: var(--dsw-alias-label-primary-foreground);
  border: 1px solid transparent;
  background: var(--dsw-alias-button-primary-fill);
}
.dsh-memory-primary:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover);
}
.dsh-memory-secondary {
  color: var(--dsw-alias-label-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
}
.dsh-memory-secondary:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-memory-danger {
  color: var(--dsw-alias-state-error-primary);
  border: 1px solid var(--dsw-alias-border-l2);
  background: transparent;
  margin-left: auto;
}
.dsh-memory-danger:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover-danger);
}
.dsh-memory-danger.is-confirm {
  border-color: var(--dsw-alias-state-error-primary);
  background: var(--dsw-alias-interactive-bg-hover-danger);
}
.dsh-memory-primary:disabled,
.dsh-memory-secondary:disabled,
.dsh-memory-danger:disabled {
  opacity: 0.45;
  cursor: default;
}
.dsh-memory-primary:focus-visible,
.dsh-memory-secondary:focus-visible,
.dsh-memory-danger:focus-visible,
.dsh-memory-row:focus-visible,
.dsh-memory-icon-button:focus-visible {
  outline: var(--dsw-focus-ring-width) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
  outline-offset: 2px;
}
.dsh-memory-notice {
  margin: 0 0 12px;
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  font-size: 13px;
  line-height: 18px;
}
.dsh-memory-notice.is-error {
  color: var(--dsw-alias-state-error-primary);
  border-color: var(--dsw-alias-state-error-primary);
}
.dsh-memory-state {
  padding: 24px 0;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-state.is-error { color: var(--dsw-alias-state-error-primary); }
.dsh-memory-state-title { margin: 0 0 6px; font-weight: 500; }
.dsh-memory-detail {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  overflow-wrap: anywhere;
}
.dsh-memory-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 8px;
}
.dsh-memory-search {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
}
.dsh-memory-search input::placeholder { color: var(--dsw-alias-label-secondary); }
.dsh-memory-count {
  flex: none;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-group { margin-top: 16px; }
.dsh-memory-group-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}
.dsh-memory-group-head h3 {
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dsh-memory-icon-button:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dsh-memory-row-wrap { border-bottom: 1px solid var(--dsw-alias-border-l1); }
.dsh-memory-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.dsh-memory-row:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh-memory-row.is-open {
  background: var(--dsw-alias-interactive-bg-hover);
  box-shadow: inset 2px 0 0 var(--dsw-alias-brand-primary);
}
.dsh-memory-row-main {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.dsh-memory-row-title {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}
.dsh-memory-row-snippet {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-row-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}
.dsh-memory-tag {
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9px;
  font-size: 11px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-date { font-size: 11px; color: var(--dsw-alias-label-secondary); }
.dsh-memory-row > svg {
  flex: none;
  margin-top: 2px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-new { margin: 8px 0 4px; }
.dsh-memory-pinned { margin: 0 0 8px; }
.dsh-memory-pinned-label {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-editor-wrap { padding: 0 0 12px; }
.dsh-memory-editor {
  display: grid;
  gap: 12px;
  margin: 4px 0 8px;
  padding: 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh-memory-editor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.dsh-memory-editor-head h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
.dsh-memory-scope-badge {
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 1px 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9px;
  font-size: 11px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-field {
  display: grid;
  gap: 5px;
  min-width: 0;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-field > span { font-weight: 600; }
.dsh-memory-field input,
.dsh-memory-field textarea,
.dsh-memory-field select {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  padding: 7px 9px;
}
.dsh-memory-field textarea {
  min-height: 180px;
  resize: vertical;
  line-height: 1.5;
}
.dsh-memory-field input:focus,
.dsh-memory-field textarea:focus,
.dsh-memory-field select:focus {
  outline: 2px solid var(--dsw-alias-brand-primary);
  outline-offset: 1px;
  border-color: transparent;
}
.dsh-memory-field input::placeholder,
.dsh-memory-field textarea::placeholder { color: var(--dsw-alias-label-secondary); }
.dsh-memory-scope-static {
  padding: 7px 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-error {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-state-error-primary);
}
.dsh-memory-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}
.dsh-memory-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 40px 16px;
  border: 1px dashed var(--dsw-alias-border-l2);
  border-radius: 10px;
  text-align: center;
  color: var(--dsw-alias-label-secondary);
}
.dsh-memory-empty h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.dsh-memory-empty p { margin: 0; max-width: 44ch; font-size: 13px; line-height: 19px; }
.dsh-memory-empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 50%;
  color: var(--dsw-alias-brand-primary);
}
.dsh-memory-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
@media (max-width: 620px) {
  .dsh-memory-header { flex-direction: column; align-items: stretch; }
  .dsh-memory-header > button { align-self: flex-start; }
  .dsh-memory-toolbar { align-items: stretch; flex-direction: column; gap: 6px; }
  .dsh-memory-count { align-self: flex-end; }
  .dsh-memory-editor { padding: 12px; }
  .dsh-memory-danger { margin-left: 0; }
}
`

    function Svg({ size = 16, children }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        'aria-hidden': 'true',
        focusable: 'false',
      }, children)
    }

    function BookmarkIcon({ size = 16 }) {
      return h(Svg, { size }, h('path', {
        d: 'M7 4.75A1.75 1.75 0 0 1 8.75 3h6.5A1.75 1.75 0 0 1 17 4.75V21l-5-3.5L7 21V4.75Z',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinejoin: 'round',
      }))
    }

    function PlusIcon({ size = 16 }) {
      return h(Svg, { size }, h('path', {
        d: 'M12 5v14M5 12h14',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
      }))
    }

    function SearchIcon({ size = 16 }) {
      return h(Svg, { size },
        h('circle', { cx: 10.5, cy: 10.5, r: 5.75, stroke: 'currentColor', strokeWidth: 1.6 }),
        h('path', { d: 'M15 15l4 4', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }))
    }

    function ChevronIcon({ size = 16, open = false }) {
      return h(Svg, { size }, h('path', {
        d: open ? 'M6 14l6-6 6 6' : 'M9 6l6 6-6 6',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }))
    }

    function RefreshIcon({ size = 16 }) {
      return h(Svg, { size },
        h('path', {
          d: 'M20 12a8 8 0 1 1-2.34-5.66',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M20 4v5h-5',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }))
    }

    function MemoryNavIcon({ size = 16 }) {
      return h(BookmarkIcon, { size })
    }

    function fill(template, values) {
      return Object.entries(values).reduce(
        (text, [key, value]) => text.split(`{${key}}`).join(String(value)),
        template,
      )
    }

    function keyOf(note) {
      return `${note.scope}:${note.cwd ?? ''}:${note.id}`
    }

    function snippet(value) {
      const text = String(value ?? '').replace(/\s+/g, ' ').trim()
      return text.length > 160 ? `${text.slice(0, 160)}…` : text
    }

    function formatDate(value) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return ''
      try {
        return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
      } catch {
        return date.toLocaleDateString()
      }
    }

    function splitTags(value) {
      return value.split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 12)
    }

    async function request(path, options = {}) {
      const init = {
        method: options.method ?? 'GET',
        credentials: 'same-origin',
        headers: { accept: 'application/json' },
        signal: options.signal,
      }
      if (options.body !== undefined) {
        init.headers['content-type'] = 'application/json'
        init.body = JSON.stringify(options.body)
      }
      const response = await fetch(`${API}${path}`, init)
      const contentType = response.headers.get('content-type') ?? ''
      if (!contentType.toLowerCase().includes('application/json')) {
        // An unmatched route reaches the SPA fallback, whose HTML must not be
        // mistaken for a successful empty store.
        const error = new Error(`Memory service returned ${response.status}.`)
        error.status = response.status
        throw error
      }
      let data = {}
      try {
        data = await response.json()
      } catch {
        // A proxy or an interrupted connection may not produce JSON.
      }
      if (!response.ok) {
        const message = typeof data?.error === 'string' && data.error.length > 0
          ? data.error
          : `Request failed (${response.status})`
        const error = new Error(message)
        error.status = response.status
        throw error
      }
      return data
    }

    function localizeError(error, t) {
      const message = error instanceof Error ? error.message : ''
      if (/already exists/i.test(message)) return t('duplicateTitle')
      if (/note not found|no memory found/i.test(message)) return t('noteNotFound')
      if (/unauthorized|forbidden/i.test(message)) return t('authError')
      if (/memory operation failed|memory request failed/i.test(message)) return t('operationFailed')
      return message.length > 0 ? message : t('operationFailed')
    }

    function MemoryPage(props) {
      const t = typeof props.t === 'function' ? props.t : key => en[key] ?? key
      const [status, setStatus] = useState('loading')
      const [notes, setNotes] = useState([])
      const [projects, setProjects] = useState([])
      const [storage, setStorage] = useState('')
      const [loadError, setLoadError] = useState('')
      const [query, setQuery] = useState('')
      const [selectedKey, setSelectedKey] = useState(null)
      const [editor, setEditor] = useState(null)
      const [busy, setBusy] = useState(false)
      const [editorError, setEditorError] = useState('')
      const [confirmDelete, setConfirmDelete] = useState(false)
      const [notice, setNotice] = useState(null)
      const abortRef = useRef(null)
      const newButtonRef = useRef(null)
      const rowRefs = useRef(new Map())

      const focusNew = () => {
        setTimeout(() => newButtonRef.current?.focus(), 0)
      }
      const focusRow = key => {
        setTimeout(() => rowRefs.current.get(key)?.focus(), 0)
      }

      const load = useCallback(async () => {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller
        setStatus(current => (current === 'ready' ? 'ready' : 'loading'))
        try {
          const data = await request('/notes', { signal: controller.signal })
          if (controller.signal.aborted) return
          const nextNotes = Array.isArray(data.notes) ? data.notes : []
          setNotes(nextNotes)
          setProjects(Array.isArray(data.projects) ? data.projects : [])
          setStorage(typeof data.storage === 'string' ? data.storage : '')
          setLoadError('')
          setStatus('ready')
          // A note removed elsewhere must not leave an orphaned editor open.
          setSelectedKey(current => (current !== null && nextNotes.some(note => keyOf(note) === current) ? current : null))
          setEditor(current => {
            if (current === null || current.mode !== 'edit') return current
            const stillExists = nextNotes.some(note => note.id === current.id
              && note.scope === current.scope
              && note.cwd === current.cwd)
            return stillExists ? current : null
          })
        } catch (error) {
          if (controller.signal.aborted || error?.name === 'AbortError') return
          setLoadError(error instanceof Error ? error.message : '')
          setStatus('error')
        }
      }, [])

      useEffect(() => {
        void load()
        return () => abortRef.current?.abort()
      }, [load])

      useEffect(() => {
        if (notice === null || notice.kind !== 'success') return undefined
        const timer = setTimeout(() => setNotice(null), 4000)
        return () => clearTimeout(timer)
      }, [notice])

      const editorDirty = editor !== null && editor.baseline !== undefined && (
        editor.title !== editor.baseline.title
        || editor.content !== editor.baseline.content
        || editor.tags !== editor.baseline.tags
        || editor.scope !== editor.baseline.scope
        || editor.cwd !== editor.baseline.cwd
      )

      useEffect(() => {
        if (!editorDirty) return undefined
        const handler = event => {
          event.preventDefault()
          event.returnValue = ''
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
      }, [editorDirty])

      const openNote = note => {
        if (editor !== null && editorDirty) {
          setEditorError(t('unsaved'))
          return
        }
        setSelectedKey(keyOf(note))
        setEditor({
          mode: 'edit',
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags.join(', '),
          scope: note.scope,
          cwd: note.cwd,
          baseline: {
            title: note.title,
            content: note.content,
            tags: note.tags.join(', '),
            scope: note.scope,
            cwd: note.cwd,
          },
        })
        setEditorError('')
        setConfirmDelete(false)
        setNotice(null)
      }

      const openNew = (scope = 'global', cwd = undefined) => {
        if (editor !== null && editorDirty) {
          setEditorError(t('unsaved'))
          return
        }
        const nextScope = scope === 'project' && cwd !== undefined ? 'project' : 'global'
        setSelectedKey(null)
        setEditor({
          mode: 'new',
          id: null,
          title: '',
          content: '',
          tags: '',
          scope: nextScope,
          cwd: nextScope === 'project' ? cwd : undefined,
          baseline: {
            title: '',
            content: '',
            tags: '',
            scope: nextScope,
            cwd: nextScope === 'project' ? cwd : undefined,
          },
        })
        setEditorError('')
        setConfirmDelete(false)
        setNotice(null)
      }

      const closeEditor = (force = false) => {
        if (busy) return
        if (!force && editorDirty) {
          setEditorError(t('unsaved'))
          return
        }
        const key = selectedKey
        setEditor(null)
        setSelectedKey(null)
        setEditorError('')
        setConfirmDelete(false)
        if (key !== null) focusRow(key)
        else focusNew()
      }

      const updateEditor = (field, value) => {
        setConfirmDelete(false)
        setEditor(current => (current === null ? current : { ...current, [field]: value }))
      }

      const changeScope = event => {
        const value = event.target.value
        setConfirmDelete(false)
        setEditor(current => {
          if (current === null) return current
          if (value === 'global') return { ...current, scope: 'global', cwd: undefined }
          return { ...current, scope: 'project', cwd: value.slice('project:'.length) }
        })
      }

      const save = async () => {
        if (editor === null || busy) return
        const title = editor.title.trim()
        const content = editor.content.trim()
        if (title.length === 0) {
          setEditorError(t('titleRequired'))
          return
        }
        if (content.length === 0) {
          setEditorError(t('contentRequired'))
          return
        }
        setBusy(true)
        setEditorError('')
        try {
          const body = {
            title,
            content,
            tags: splitTags(editor.tags),
            scope: editor.scope,
            cwd: editor.scope === 'project' ? editor.cwd : undefined,
          }
          if (editor.mode === 'edit') body.id = editor.id
          const data = await request('/save', { method: 'POST', body })
          await load()
          setQuery('')
          if (data?.note) {
            const key = keyOf(data.note)
            setSelectedKey(key)
            focusRow(key)
          } else {
            focusNew()
          }
          setEditor(null)
          setConfirmDelete(false)
          setNotice({ kind: 'success', text: t('saved') })
        } catch (error) {
          setEditorError(localizeError(error, t))
        } finally {
          setBusy(false)
        }
      }

      const remove = async () => {
        if (editor === null || editor.mode !== 'edit' || busy) return
        if (!confirmDelete) {
          setConfirmDelete(true)
          return
        }
        setBusy(true)
        setEditorError('')
        try {
          await request('/delete', {
            method: 'POST',
            body: {
              id: editor.id,
              scope: editor.scope,
              cwd: editor.scope === 'project' ? editor.cwd : undefined,
            },
          })
          setEditor(null)
          setSelectedKey(null)
          setConfirmDelete(false)
          await load()
          focusNew()
          setNotice({ kind: 'success', text: t('deleted') })
        } catch (error) {
          setEditorError(localizeError(error, t))
        } finally {
          setBusy(false)
        }
      }

      const onEditorKeyDown = event => {
        if (event.key === 'Escape' && !busy) {
          event.preventDefault()
          event.stopPropagation()
          closeEditor(true)
          return
        }
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          event.preventDefault()
          void save()
        }
      }

      const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase()
        if (needle.length === 0) return notes
        return notes.filter(note => note.title.toLowerCase().includes(needle)
          || note.content.toLowerCase().includes(needle)
          || note.tags.some(tag => tag.toLowerCase().includes(needle)))
      }, [notes, query])

      const groups = useMemo(() => {
        const map = new Map()
        for (const note of filtered) {
          const groupKey = note.scope === 'global' ? 'global' : `project:${note.cwd ?? ''}`
          let group = map.get(groupKey)
          if (group === undefined) {
            group = {
              key: groupKey,
              scope: note.scope,
              cwd: note.cwd,
              label: note.scope === 'global'
                ? t('global')
                : (note.displayCwd || note.cwd || t('unknownWorkspace')),
              notes: [],
            }
            map.set(groupKey, group)
          }
          group.notes.push(note)
        }
        return [...map.values()].sort((left, right) => {
          if (left.scope === right.scope) return left.label.localeCompare(right.label)
          return left.scope === 'global' ? -1 : 1
        })
      }, [filtered, t])

      const selectedNote = useMemo(
        () => notes.find(note => keyOf(note) === selectedKey),
        [notes, selectedKey],
      )
      const selectedVisible = useMemo(
        () => filtered.some(note => keyOf(note) === selectedKey),
        [filtered, selectedKey],
      )

      const renderEditor = () => {
        if (editor === null) return null
        const isNew = editor.mode === 'new'
        const scopeValue = editor.scope === 'global' ? 'global' : `project:${editor.cwd}`
        const scopeOptions = [
          { value: 'global', label: t('global') },
          ...projects.map(project => ({ value: `project:${project.cwd}`, label: project.label })),
        ]
        const projectLabel = projects.find(project => project.cwd === editor.cwd)?.label
          ?? editor.cwd
          ?? t('unknownWorkspace')
        return h('div', {
          className: 'dsh-memory-editor',
          role: 'group',
          'aria-label': isNew ? t('editorNew') : t('editorEdit'),
          onKeyDown: onEditorKeyDown,
        },
          h('div', { className: 'dsh-memory-editor-head' },
            h('h3', null, isNew ? t('editorNew') : t('editorEdit')),
            !isNew && h('span', { className: 'dsh-memory-scope-badge' },
              editor.scope === 'global' ? t('global') : projectLabel),
          ),
          h('label', { className: 'dsh-memory-field' },
            h('span', null, t('titleLabel')),
            h('input', {
              id: 'dsh-memory-title',
              value: editor.title,
              maxLength: 120,
              autoFocus: true,
              placeholder: t('titlePlaceholder'),
              onChange: event => updateEditor('title', event.target.value),
            }),
          ),
          h('label', { className: 'dsh-memory-field' },
            h('span', null, t('contentLabel')),
            h('textarea', {
              id: 'dsh-memory-content',
              value: editor.content,
              rows: 8,
              maxLength: 20000,
              placeholder: t('contentPlaceholder'),
              onChange: event => updateEditor('content', event.target.value),
            }),
          ),
          h('label', { className: 'dsh-memory-field' },
            h('span', null, t('tagsLabel')),
            h('input', {
              id: 'dsh-memory-tags',
              value: editor.tags,
              placeholder: t('tagsHint'),
              onChange: event => updateEditor('tags', event.target.value),
            }),
          ),
          isNew && h('label', { className: 'dsh-memory-field' },
            h('span', null, t('scopeLabel')),
            projects.length > 0
              ? h('select', { value: scopeValue, onChange: changeScope },
                scopeOptions.map(option => h('option', { key: option.value, value: option.value }, option.label)))
              : h('span', { className: 'dsh-memory-scope-static' }, t('global')),
          ),
          editorError.length > 0 && h('div', { className: 'dsh-memory-error', role: 'alert' }, editorError),
          h('div', { className: 'dsh-memory-actions' },
            h('span', { className: 'dsh-memory-sr', role: 'status' },
              confirmDelete ? t('confirmDeleteHint') : ''),
            h('button', {
              type: 'button',
              className: 'dsh-memory-primary',
              disabled: busy || editor.title.trim().length === 0 || editor.content.trim().length === 0,
              onClick: () => { void save() },
            }, busy ? t('saving') : t('save')),
            h('button', {
              type: 'button',
              className: 'dsh-memory-secondary',
              disabled: busy,
              onClick: () => closeEditor(true),
            }, t('cancel')),
            !isNew && h('button', {
              type: 'button',
              className: confirmDelete ? 'dsh-memory-danger is-confirm' : 'dsh-memory-danger',
              disabled: busy,
              onClick: () => { void remove() },
            }, busy ? t('deleting') : (confirmDelete ? t('confirmDelete') : t('delete'))),
          ),
        )
      }

      return h('div', { className: 'dsh-memory-page' },
        h('style', null, CSS),
        h('header', { className: 'dsh-memory-header' },
          h('div', { className: 'dsh-memory-heading' },
            h('h2', null, t('title')),
            h('p', null, t('description')),
          ),
          h('button', {
            ref: newButtonRef,
            type: 'button',
            className: 'dsh-memory-primary',
            disabled: status !== 'ready',
            onClick: () => openNew('global'),
          },
            h(PlusIcon, { size: 15 }),
            h('span', null, t('new')),
          ),
        ),
        storage.length > 0 && h('p', { className: 'dsh-memory-storage' },
          fill(t('storage'), { path: storage })),
        notice !== null && h('div', {
          className: notice.kind === 'error' ? 'dsh-memory-notice is-error' : 'dsh-memory-notice',
          role: notice.kind === 'error' ? 'alert' : 'status',
        }, notice.text),
        status === 'loading' && h('div', { className: 'dsh-memory-state', role: 'status' }, t('loading')),
        status === 'error' && h('div', { className: 'dsh-memory-state is-error', role: 'alert' },
          h('p', { className: 'dsh-memory-state-title' }, t('loadError')),
          loadError.length > 0 && h('p', { className: 'dsh-memory-detail' }, localizeError(new Error(loadError), t)),
          h('button', {
            type: 'button',
            className: 'dsh-memory-secondary',
            onClick: () => { void load() },
          }, t('retry')),
        ),
        status === 'ready' && h('div', { className: 'dsh-memory-content' },
          h('div', { className: 'dsh-memory-toolbar' },
            h('div', { className: 'dsh-memory-search' },
              h(SearchIcon, { size: 15 }),
              h('input', {
                type: 'search',
                value: query,
                placeholder: t('search'),
                'aria-label': t('search'),
                onChange: event => setQuery(event.target.value),
              }),
            ),
            h('span', { className: 'dsh-memory-count', 'aria-live': 'polite' },
              fill(filtered.length === 1 ? t('countOne') : t('countMany'), { count: filtered.length })),
            h('button', {
              type: 'button',
              className: 'dsh-memory-icon-button',
              'aria-label': t('refresh'),
              title: t('refresh'),
              onClick: () => { void load() },
            }, h(RefreshIcon, { size: 15 })),
          ),
          editor !== null && editor.mode === 'new' && h('div', { className: 'dsh-memory-new' }, renderEditor()),
          editor !== null && editor.mode === 'edit' && selectedNote !== undefined && !selectedVisible
            && h('div', { className: 'dsh-memory-pinned' },
              h('div', { className: 'dsh-memory-pinned-label' }, t('editing')),
              renderEditor(),
            ),
          groups.map(group => h('section', { key: group.key, className: 'dsh-memory-group' },
            h('div', { className: 'dsh-memory-group-head' },
              h('h3', { title: group.label }, group.label),
              h('button', {
                type: 'button',
                className: 'dsh-memory-icon-button',
                'aria-label': fill(t('newIn'), { group: group.label }),
                onClick: () => openNew(group.scope, group.cwd),
              }, h(PlusIcon, { size: 14 })),
            ),
            group.notes.map(note => {
              const key = keyOf(note)
              const open = selectedKey === key && editor !== null && editor.mode === 'edit'
              return h('div', { key, className: 'dsh-memory-row-wrap' },
                h('button', {
                  ref: node => {
                    if (node === null) rowRefs.current.delete(key)
                    else rowRefs.current.set(key, node)
                  },
                  type: 'button',
                  className: open ? 'dsh-memory-row is-open' : 'dsh-memory-row',
                  'aria-expanded': open,
                  title: note.title,
                  onClick: () => {
                    if (open) closeEditor()
                    else openNote(note)
                  },
                },
                  h('span', { className: 'dsh-memory-row-main' },
                    h('span', { className: 'dsh-memory-row-title' }, note.title),
                    h('span', { className: 'dsh-memory-row-snippet' }, snippet(note.content)),
                    h('span', { className: 'dsh-memory-row-meta' },
                      ...note.tags.map(tag => h('span', { key: tag, className: 'dsh-memory-tag' }, tag)),
                      note.updatedAt && h('span', { className: 'dsh-memory-date' },
                        fill(t('updated'), { date: formatDate(note.updatedAt) })),
                    ),
                  ),
                  h(ChevronIcon, { size: 16, open }),
                ),
                open && h('div', { className: 'dsh-memory-editor-wrap' }, renderEditor()),
              )
            }),
          )),
          filtered.length === 0 && editor === null && h('div', { className: 'dsh-memory-empty' },
            h('div', { className: 'dsh-memory-empty-icon' }, h(BookmarkIcon, { size: 26 })),
            h('h3', null, notes.length === 0 ? t('empty') : t('noMatches')),
            h('p', null, notes.length === 0 ? t('emptyHint') : t('searchHint')),
            notes.length === 0
              ? h('button', {
                type: 'button',
                className: 'dsh-memory-primary',
                onClick: () => openNew('global'),
              }, h(PlusIcon, { size: 15 }), h('span', null, t('new')))
              : h('button', {
                type: 'button',
                className: 'dsh-memory-secondary',
                onClick: () => setQuery(''),
              }, t('clearSearch')),
          ),
        ),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-memory: dictionaries')
        const t = ctx.locale.bind(NS)
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'memory',
          order: 40,
          label: () => t('nav'),
          locale: NS,
        }, MemoryPage))
        ctx.slots.inject('settings.section.icon', () => ctx.slots.register({
          name: 'settings.section.icon',
          id: 'memory',
          locale: NS,
        }, MemoryNavIcon))
      },
    }
  },
})
