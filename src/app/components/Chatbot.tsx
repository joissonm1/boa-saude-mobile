import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: 'Olá! Eu sou seu assistente virtual. (Mock) — Em breve teremos IA integrada.' },
    { id: 2, from: 'bot', text: 'Teste uma pergunta, por exemplo: "Como agendo uma consulta?"' },
  ]);
  const nextId = useRef(3);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const id = nextId.current++;
    setMessages((m) => [...m, { id, from: 'user', text }]);
    setInput('');

    // Mock bot reply
    setTimeout(() => {
      const botId = nextId.current++;
      const reply = generateMockReply(text);
      setMessages((m) => [...m, { id: botId, from: 'bot', text: reply }]);
    }, 700);
  }

  function generateMockReply(userText: string) {
    const lower = userText.toLowerCase();
    if (lower.includes('agend') || lower.includes('consulta')) {
      return 'Para agendar uma consulta, vá à tela "Nova Consulta" e escolha entre Virtual ou Presencial.';
    }
    if (lower.includes('horário') || lower.includes('quando')) {
      return 'Temos vagas na próxima semana nos horários das 9h, 11h e 14h.';
    }
    if (lower.includes('remédio') || lower.includes('receita')) {
      return 'Você pode consultar suas receitas na aba "Receitas".';
    }
    return 'Desculpe, ainda estou em modo mock. Essa resposta é um exemplo — Em breve teremos respostas reais.';
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div>
      {/* Floating button */}
      <button
        aria-label="Abrir assistente"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-4 z-50 bg-teal-600 text-white p-3 rounded-full shadow-xl hover:scale-105 transition-transform"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed right-4 bottom-20 z-50 w-80 md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <div>
                <div className="font-semibold">Assistente Virtual</div>
                <div className="text-xs text-gray-500">Mock / Em breve</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                }}
                className="p-2 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="p-3 flex-1 overflow-auto space-y-3 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'user' ? 'bg-teal-500 text-white' : 'bg-white text-gray-800 border'} max-w-[80%] p-2 rounded-lg shadow-sm`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Escreva uma mensagem..."
                className="flex-1 border-2 border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-300"
              />
              <button onClick={sendMessage} className="bg-teal-600 text-white p-2 rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
