'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ content, onChange }) => {
  const [mounted, setMounted] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-slate-300 pl-4 italic my-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-slate-100 rounded-lg p-4 font-mono text-sm my-4',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-800',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] px-4 py-3 [&_p]:my-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_a]:text-indigo-600 [&_a]:underline',
      },
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && mounted && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor, mounted]);

  if (!mounted || !editor) {
    return (
      <div className="border border-slate-300 rounded-lg bg-white min-h-[400px] p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          editor.chain().focus().setImage({ src: base64 }).run();
        }
      };
      reader.readAsDataURL(file);
    };
  };

  return (
    <div className="border border-slate-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 flex items-center gap-2 flex-wrap">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('bold')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title="Bold (Ctrl+B)"
          >
            <span className="material-symbols-outlined text-lg">format_bold</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('italic')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title="Italic (Ctrl+I)"
          >
            <span className="material-symbols-outlined text-lg">format_italic</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('strike')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title="Strikethrough"
          >
            <span className="material-symbols-outlined text-lg">strikethrough_s</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('code')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            title="Inline Code"
          >
            <span className="material-symbols-outlined text-lg">code</span>
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('heading', { level: 1 })
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Heading 1"
          >
            <span className="material-symbols-outlined text-lg">title</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('heading', { level: 2 })
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Heading 2"
          >
            <span className="material-symbols-outlined text-lg">text_fields</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('heading', { level: 3 })
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Heading 3"
          >
            <span className="material-symbols-outlined text-lg">text_fields</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('paragraph')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Paragraph"
          >
            <span className="material-symbols-outlined text-lg">text_snippet</span>
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('bulletList')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-lg">format_list_bulleted</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('orderedList')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Ordered List"
          >
            <span className="material-symbols-outlined text-lg">format_list_numbered</span>
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('blockquote')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Blockquote"
          >
            <span className="material-symbols-outlined text-lg">format_quote</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('codeBlock')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Code Block"
          >
            <span className="material-symbols-outlined text-lg">code_blocks</span>
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
            title="Horizontal Rule"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
        </div>

        {/* Links & Media */}
        <div className="flex items-center gap-1 border-r border-slate-300 pr-2 mr-2">
          <button
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              if (previousUrl) {
                setLinkUrl(previousUrl);
              } else {
                setLinkUrl('');
              }
              setShowLinkModal(true);
            }}
            className={`p-2 rounded-lg transition-colors ${
              editor.isActive('link')
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
            title="Insert/Edit Link"
          >
            <span className="material-symbols-outlined text-lg">link</span>
          </button>
          <button
            onClick={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              }
            }}
            disabled={!editor.isActive('link')}
            className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove Link"
          >
            <span className="material-symbols-outlined text-lg">link_off</span>
          </button>
          <button
            onClick={handleImageUpload}
            className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200"
            title="Insert Image"
          >
            <span className="material-symbols-outlined text-lg">image</span>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <span className="material-symbols-outlined text-lg">undo</span>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded-lg transition-colors text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <span className="material-symbols-outlined text-lg">redo</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Insert Link</h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl('');
                }}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-slate-600">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (linkUrl) {
                        editor.chain().focus().setLink({ href: linkUrl }).run();
                        setShowLinkModal(false);
                        setLinkUrl('');
                      }
                    }
                    if (e.key === 'Escape') {
                      setShowLinkModal(false);
                      setLinkUrl('');
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkUrl('');
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (linkUrl) {
                      // If no text is selected, insert the URL as text
                      if (editor.state.selection.empty) {
                        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
                      } else {
                        editor.chain().focus().setLink({ href: linkUrl }).run();
                      }
                      setShowLinkModal(false);
                      setLinkUrl('');
                    }
                  }}
                  disabled={!linkUrl}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
