import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';

const RichTextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Placeholder.configure({
        placeholder: 'Write your post...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => setContent(editor.getHTML()), // store rich content
  });

  if (!editor) return null;

  return (
    <div className="w-full border rounded-lg p-4 min-h-[200px] focus-within:ring-2 focus-within:ring-blue-400 transition">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
