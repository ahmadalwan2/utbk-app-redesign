import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { AIResponse } from '../../components/ui/AIResponse';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { askAI } from '../../utils/ai';
import { Clock, Rocket, RotateCcw, LineChart, Bot, Check, X, FileQuestion, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { api } from '../../utils/apiClient';
import { useNavigate } from 'react-router-dom';

export function Tryout({ addScore }) {
  const [phase, setPhase] = useState("intro");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [mapel, setMapel] = useState("TPS");
  const [jumlah, setJumlah] = useState(10);
  const [resultDetail, setResultDetail] = useState(null);

  const timerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (phase === "quiz") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { 
            clearInterval(timerRef.current); 
            finishTryout(); 
            return 0; 
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startTryout = async () => {
    setLoading(true);
    try {
      const res = await api.mulaiLatihan(mapel, jumlah);
      setSession(res.data);
      setQuestions(res.data.soal);
      setCurrent(0);
      setAnswers({});
      setTimeLeft(jumlah * 60); // 1 minute per question
      setPhase("quiz");
    } catch (err) {
      alert("Gagal memulai tryout: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishTryout = async () => {
    clearInterval(timerRef.current);
    setLoading(true);
    try {
      // Format answers for backend: { soalId: "uuid", jawaban: "A" }
      const formattedAnswers = Object.keys(answers).map(idx => {
        const optionKeys = ["A", "B", "C", "D", "E"];
        return {
          soalId: questions[idx].id,
          jawaban: optionKeys[answers[idx]]
        };
      });

      const submitRes = await api.submitLatihan(session.id, formattedAnswers);
      const detailRes = await api.getDetailLatihan(session.id);
      
      setResultDetail(detailRes.data);
      if (addScore) addScore(submitRes.data.skor);
      setPhase("result");
    } catch (err) {
      alert("Gagal submit tryout: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx) => {
    setAnswers(prev => ({ ...prev, [current]: idx }));
    setExplanation(""); 
    setLoadingExplain(false);
  };

  const getExplanation = async () => {
    setLoadingExplain(true); setExplanation("");
    const q = questions[current];
    await askAI(
      "Kamu adalah tutor UTBK. Jelaskan pembahasan soal dengan singkat dan jelas dalam Bahasa Indonesia. Maksimal 150 kata.",
      `Soal: ${q.pertanyaan}\n\nBerikan petunjuk pengerjaan tanpa menyebut jawaban akhirnya, karena siswa sedang ujian.`,
      (text) => { setExplanation(text); setLoadingExplain(false); }
    );
  };

  if (phase === "intro") return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1.5">Simulasi Tryout</h1>
        <p className="text-muted text-[13px]">Uji kemampuanmu dengan soal-soal asli dari backend.</p>
      </header>

      <Card className="p-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase mb-2">Pilih Mata Pelajaran</label>
            <CustomSelect 
              value={mapel}
              onChange={setMapel}
              options={[
                { label: "Tes Potensi Skolastik (TPS)", value: "TPS" },
                { label: "TKA Saintek", value: "TKA_SAINTEK" },
                { label: "TKA Soshum", value: "TKA_SOSHUM" }
              ]}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-muted uppercase mb-2">Jumlah Soal</label>
            <CustomSelect 
              value={jumlah}
              onChange={(val) => setJumlah(Number(val))}
              options={[
                { label: "5 Soal", value: 5 },
                { label: "10 Soal", value: 10 },
                { label: "20 Soal", value: 20 }
              ]}
            />
          </div>
        </div>

        <button 
          onClick={startTryout} 
          disabled={loading}
          className="w-full bg-primary text-primary-fg border-2 border-primary rounded-lg py-3 px-5 font-bold text-[13px] cursor-pointer hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Rocket size={14} /> Mulai Tryout</>}
        </button>
      </Card>
    </div>
  );

  if (phase === "result" && resultDetail) {
    const skor = resultDetail.skor;
    const grade = skor >= 700 ? { label: "Sangat Baik", variant: "success" } : skor >= 500 ? { label: "Cukup Baik", variant: "warning" } : { label: "Perlu Latihan", variant: "danger" };
    
    // hitung benar salah dari result detail
    const correctCount = resultDetail.jawabans.filter(j => j.benar).length;
    const answeredCount = resultDetail.jawabans.length;
    const totalQ = questions.length;
    
    return (
      <div className="space-y-5">
        <div className="text-center py-8 pb-5 border-b-2 border-border">
          <div className="text-5xl font-black text-primary leading-none tracking-tighter mb-3">{skor}</div>
          <div className="text-[11px] text-muted mb-3 uppercase tracking-widest font-extrabold">Total Skor UTBK</div>
          <Badge variant={grade.variant}>{grade.label}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <Card className="p-3 flex flex-col items-center justify-center">
            <div className="text-xl font-black text-success mb-0.5">{correctCount}</div>
            <div className="text-[11px] text-muted font-bold">Benar</div>
          </Card>
          <Card className="p-3 flex flex-col items-center justify-center">
            <div className="text-xl font-black text-danger mb-0.5">{answeredCount - correctCount}</div>
            <div className="text-[11px] text-muted font-bold">Salah</div>
          </Card>
          <Card className="p-3 flex flex-col items-center justify-center">
            <div className="text-xl font-black text-warning mb-0.5">{totalQ - answeredCount}</div>
            <div className="text-[11px] text-muted font-bold">Kosong</div>
          </Card>
        </div>

        <div className="space-y-3 pt-3">
          <h3 className="font-extrabold text-[15px] mb-2">Review Jawaban</h3>
          {questions.map((q, i) => {
            // cari jawaban di result detail
            const resultAns = resultDetail.jawabans.find(j => j.soalId === q.id);
            const isCorrect = resultAns ? resultAns.benar : false;
            const isAnswered = !!resultAns;
            
            return (
              <div key={i} className={`flex gap-3 items-start bg-surface rounded-xl p-3.5 border-2 ${isCorrect ? 'border-success/50' : isAnswered ? 'border-danger/50' : 'border-border'}`}>
                <div className={`mt-0.5 shrink-0 ${isCorrect ? 'text-success' : isAnswered ? 'text-danger' : 'text-muted'}`}>
                  {isCorrect ? <Check size={16} /> : isAnswered ? <X size={16} /> : <div className="w-3.5 h-3.5 border-2 border-muted rounded-sm" />}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] text-text leading-relaxed font-bold mb-2">{q.pertanyaan.replace(/^\[SEED\]\s*/i, '')}</div>
                  {isAnswered && !isCorrect && <div className="text-[11px] font-bold text-danger mb-1">Jawabmu: {resultAns.jawabanUser}</div>}
                  {resultAns && (
                    <div className="text-[11px] font-bold text-success bg-success/10 border-2 border-success/20 px-2.5 py-1.5 rounded-md inline-block">
                      Kunci: {resultAns.kunciJawaban} - {q.opsi[resultAns.kunciJawaban]}
                    </div>
                  )}
                  {resultAns?.soal?.pembahasan && (
                    <div className="mt-2 text-[12px] text-muted italic">"{resultAns.soal.pembahasan}"</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <button 
            onClick={() => { setPhase("intro"); }} 
            className="flex items-center justify-center gap-2 bg-surface border-2 border-border rounded-lg py-2.5 px-5 text-text cursor-pointer font-bold text-[13px] hover:bg-surface-hover transition-colors"
          >
            <RotateCcw size={14} />
            Tryout Lagi
          </button>
          <button 
            onClick={() => navigate('/skor')} 
            className="flex items-center justify-center gap-2 bg-primary border-2 border-primary rounded-lg py-2.5 px-5 text-primary-fg cursor-pointer font-bold text-[13px] hover:bg-primary/90 transition-colors"
          >
            <LineChart size={14} />
            Lihat Analisis
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const totalQ = questions.length;
  if (!q) return null;

  const optionKeys = ["A", "B", "C", "D", "E"];

  // Quiz phase
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div className="flex gap-1.5">
          <Badge variant="primary">{q.mapel}</Badge>
          <Badge>{q.tingkat}</Badge>
        </div>
        <div className={`flex items-center gap-1.5 font-mono text-[12px] font-bold bg-surface px-2.5 py-1 rounded-md border-2 ${timeLeft < 60 ? 'text-danger border-danger/50' : 'text-text border-border'}`}>
          <Clock size={14} className={timeLeft < 60 ? 'animate-pulse' : ''} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pr-1 pb-20 md:pb-0">
        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-extrabold text-muted">Soal {current + 1} / {totalQ}</span>
            <span className="text-[11px] font-extrabold text-muted">{Object.keys(answers).length} dijawab</span>
          </div>
          <ProgressBar value={current + 1} max={totalQ} />
        </div>

        {/* Question */}
        <Card className="mb-4 bg-surface border-2 border-border p-5">
          <div className="text-[14px] text-text leading-relaxed font-bold whitespace-pre-wrap">{q.pertanyaan.replace(/^\[SEED\]\s*/i, '')}</div>
        </Card>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {optionKeys.map((key, i) => {
            const selected = answers[current] === i;
            return (
              <button 
                key={i} 
                onClick={() => handleAnswer(i)} 
                className={twMerge(
                  "w-full flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer text-left transition-all",
                  selected ? "bg-primary/10 border-primary font-bold text-text" : "bg-surface border-border text-text hover:border-muted hover:bg-surface-hover font-medium"
                )}
              >
                <div className={twMerge(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[10px] font-bold transition-colors",
                  selected ? "border-primary bg-primary text-primary-fg" : "border-border text-muted"
                )}>
                  {key}
                </div>
                <div className="text-[13px] leading-relaxed">{q.opsi[key]}</div>
              </button>
            );
          })}
        </div>

        {/* Explanation toggle */}
        {answers[current] !== undefined && (
          <div className="mb-4">
            {!explanation && !loadingExplain && (
              <button 
                onClick={getExplanation} 
                className="flex items-center gap-1.5 bg-surface-hover border-2 border-border rounded-lg px-3 py-2 text-text cursor-pointer text-[12px] font-extrabold hover:bg-border transition-colors"
              >
                <Bot size={14} />
                Minta Petunjuk AI
              </button>
            )}
            {(loadingExplain || explanation) && (
              <div className="bg-surface border-2 border-border p-3 rounded-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-accent mb-2">
                  <Bot size={12} />
                  AI Tutor
                </div>
                <AIResponse text={explanation} loading={loadingExplain} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2.5 shrink-0 pt-4 border-t-2 border-border mt-auto">
        <button 
          onClick={() => setCurrent(c => Math.max(0, c - 1))} 
          disabled={current === 0} 
          className={`flex-1 rounded-lg py-2.5 px-5 font-bold text-[13px] border-2 transition-colors ${current === 0 ? 'bg-surface-hover border-transparent text-muted/50 cursor-not-allowed' : 'bg-surface border-border text-text cursor-pointer hover:bg-surface-hover'}`}
        >
          Previous
        </button>
        {current < totalQ - 1 ? (
          <button 
            onClick={() => { setCurrent(c => c + 1); setExplanation(""); setLoadingExplain(false); }} 
            className="flex-1 bg-primary border-2 border-primary rounded-lg py-2.5 px-5 text-primary-fg cursor-pointer font-bold text-[13px] hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={finishTryout} 
            disabled={loading}
            className="flex-1 bg-success border-2 border-success rounded-lg py-2.5 px-5 text-primary-fg cursor-pointer font-bold text-[13px] hover:bg-success/90 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin inline" /> : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}
