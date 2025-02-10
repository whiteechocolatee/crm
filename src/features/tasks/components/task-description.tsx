import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { Pencil, X, Smile } from 'lucide-react';
import DottedSeparator from '@/components/dotted-separator';
import { useUpdateTask } from '../api/use-update-task';
import ReactQuill from 'react-quill';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import 'react-quill/dist/quill.snow.css';

type TaskDescriptionProps = {
  task: Task;
};

function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState<string>(task.description || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { mutate, isPending } = useUpdateTask();

  // Закрытие эмодзи-пикера при клике вне
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current?.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  // Закрытие эмодзи-пикера при выходе из режима редактирования
  useEffect(() => {
    if (!isEditable) {
      setShowEmojiPicker(false);
    }
  }, [isEditable]);

  const insertEmoji = useCallback((emojiData: EmojiClickData) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      editor.insertText(range.index, emojiData.emoji);
      editor.setSelection(range.index + emojiData.emoji.length, 0);
    }
  }, []);

  const toggleEmojiPicker = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojiPicker(prev => !prev);
  }, []);

  const handleSave = useCallback(() => {
    mutate(
      {
        json: { description: value },
        param: { taskId: task.$id },
      },
      {
        onSuccess: () => {
          setIsEditable(false);
        },
      },
    );
  }, [mutate, value, task.$id]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
  ];

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Описание</p>
        <Button
          onClick={() => setIsEditable(prev => !prev)}
          size="sm"
          variant="secondary"
        >
          {isEditable ? (
            <X className="mr-2 size-4" />
          ) : (
            <Pencil className="mr-2 size-4" />
          )}
          {isEditable ? 'Отменить' : 'Редактировать'}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditable ? (
        <div className="flex flex-col gap-y-4">
          <div className="relative">
            <div className="[&_.ql-container]:h-[200px] [&_.ql-editor]:min-h-[200px]">
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={setValue}
                modules={modules}
                formats={formats}
                placeholder="Описание задачи..."
              />
            </div>

            {/* Кнопка эмодзи */}
            <button
              ref={emojiButtonRef}
              onClick={toggleEmojiPicker}
              className="absolute right-2 top-2 rounded-md p-1.5 hover:bg-gray-100"
              type="button"
            >
              <Smile className="size-4" />
            </button>

            {/* Эмодзи пикер */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute right-0 top-12 z-50"
              >
                <EmojiPicker
                  onEmojiClick={insertEmoji}
                  searchPlaceholder="Поиск эмодзи..."
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>

          <Button
            onClick={handleSave}
            className="ml-auto w-fit"
            disabled={isPending}
            size="sm"
          >
            {isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: task.description || 'Нет описания',
          }}
        />
      )}
    </div>
  );
}

export default TaskDescription;
