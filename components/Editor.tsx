"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { createLowlight } from "lowlight";
import { useEffect, useState } from "react";

const lowlight = createLowlight();

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function Editor({ content, onChange, placeholder }: EditorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [slashPosition, setSlashPosition] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const editor = useEditor({
    immediatelyRender: false, // SSR hydration mismatch 방지
    extensions: [
      StarterKit.configure({
        codeBlock: false, // lowlight 버전을 사용
        listItem: {
          // 리스트 아이템에서 백스페이스 동작 커스터마이징
          HTMLAttributes: {
            class: "list-item-custom",
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "'/'를 입력하여 명령어를 확인하세요...",
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none p-6 min-h-[500px]",
      },
      handleKeyDown: (view, event) => {
        // ESC로 메뉴 닫기
        if (event.key === "Escape" && showMenu) {
          setShowMenu(false);
          return true;
        }

        // 백스페이스 키 - 리스트에서 들여쓰기 처리
        if (event.key === "Backspace") {
          const { state } = view;
          const { selection, doc } = state;
          const { $from } = selection;

          // 커서가 줄의 시작 부분에 있는지 확인
          const isAtStart = $from.parentOffset === 0;

          if (isAtStart) {
            const parent = $from.parent;
            
            // 리스트 아이템이고 내용이 비어있는 경우
            if (
              (parent.type.name === "listItem" || parent.type.name === "taskItem") &&
              parent.textContent.length === 0
            ) {
              // 들여쓰기 레벨 확인
              const depth = $from.depth;
              
              if (depth > 2) {
                // 들여쓰기가 있으면 한 단계 내어쓰기
                event.preventDefault();
                editor?.commands.liftListItem(parent.type.name);
                return true;
              }
            }
          }
        }

        // 슬래시 명령어 트리거
        if (event.key === "/") {
          // 슬래시 입력 **전** 위치 저장 (중요!)
          const { selection } = view.state;
          const { $from } = selection;
          const posBeforeSlash = $from.pos; // 슬래시가 입력될 위치
          
          setTimeout(() => {
            // 슬래시 입력 **후** 좌표 계산
            const coords = view.coordsAtPos(posBeforeSlash + 1);
            
            setMenuPosition({ 
              x: coords.left, 
              y: coords.top + 25 // 커서 바로 아래에 표시
            });
            setSlashPosition(posBeforeSlash); // 슬래시 입력 전 위치 저장
            setShowMenu(true);
            setSearchQuery("");
          }, 0);
        }
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const executeCommand = (commandFn: () => void) => {
    if (slashPosition !== null && editor) {
      // 현재 커서 위치 확인
      const currentPos = editor.state.selection.from;
      
      // 슬래시부터 현재 커서까지 모두 삭제 (슬래시 + 검색어)
      editor
        .chain()
        .focus()
        .deleteRange({ from: slashPosition, to: currentPos })
        .run();
      
      // 명령어 실행
      setTimeout(() => {
        commandFn();
      }, 10);
    }
    setShowMenu(false);
    setSlashPosition(null);
    setSelectedIndex(0);
  };

  const commands = [
    {
      title: "/제목1",
      command: () => executeCommand(() => editor?.chain().focus().toggleHeading({ level: 1 }).run()),
      icon: "H1",
    },
    {
      title: "/제목2",
      command: () => executeCommand(() => editor?.chain().focus().toggleHeading({ level: 2 }).run()),
      icon: "H2",
    },
    {
      title: "/제목3",
      command: () => executeCommand(() => editor?.chain().focus().toggleHeading({ level: 3 }).run()),
      icon: "H3",
    },
    {
      title: "/글머리 기호 목록",
      command: () => executeCommand(() => editor?.chain().focus().toggleBulletList().run()),
      icon: "•",
    },
    {
      title: "/번호 매기기 목록",
      command: () => executeCommand(() => editor?.chain().focus().toggleOrderedList().run()),
      icon: "1.",
    },
    {
      title: "/체크박스",
      command: () => executeCommand(() => editor?.chain().focus().toggleTaskList().run()),
      icon: "☑",
    },
    {
      title: "/코드 블록",
      command: () => executeCommand(() => editor?.chain().focus().toggleCodeBlock().run()),
      icon: "</>",
    },
    {
      title: "/인용구",
      command: () => executeCommand(() => editor?.chain().focus().toggleBlockquote().run()),
      icon: "\"",
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 검색어 변경 시 선택 인덱스 초기화
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  if (!editor) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="relative">
      {/* 슬래시 명령어 메뉴 */}
      {showMenu && (
        <div
          className="fixed z-50 bg-white border rounded-lg shadow-xl p-2 w-72"
          style={{ 
            left: `${menuPosition.x}px`, 
            top: `${menuPosition.y}px`,
          }}
        >
          <input
            type="text"
            placeholder="명령어 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => 
                  prev < filteredCommands.length - 1 ? prev + 1 : prev
                );
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                  filteredCommands[selectedIndex].command();
                }
              } else if (e.key === "Escape") {
                e.preventDefault();
                setShowMenu(false);
                setSlashPosition(null);
                setSelectedIndex(0);
                editor?.commands.focus();
              }
            }}
            className="w-full px-3 py-2 border rounded mb-2 text-sm focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => cmd.command()}
                  className={`w-full text-left px-3 py-2 rounded flex items-center gap-3 transition ${
                    index === selectedIndex
                      ? "bg-blue-100 text-blue-900"
                      : "hover:bg-blue-50"
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="text-lg font-mono w-8 text-gray-600">{cmd.icon}</span>
                  <span className="text-sm font-medium">{cmd.title}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                검색 결과가 없습니다
              </div>
            )}
          </div>
        </div>
      )}

      {/* 툴바 - 텍스트 포맷 버튼 */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex gap-2 z-10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-200 font-bold" : ""}`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 font-mono text-sm ${editor.isActive("code") ? "bg-gray-200" : ""}`}
        >
          {"<>"}
        </button>
        <div className="w-px bg-gray-300 mx-2" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          • 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          1. 목록
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`px-3 py-1.5 rounded hover:bg-gray-100 ${editor.isActive("taskList") ? "bg-gray-200" : ""}`}
        >
          ☑ 체크
        </button>
      </div>

      <EditorContent editor={editor} />

      {/* 배경 클릭 시 메뉴 닫기 */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowMenu(false);
            setSlashPosition(null);
          }}
        />
      )}
    </div>
  );
}

