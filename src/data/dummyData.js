export const TRYOUT_QUESTIONS = [
  {
    id: 1, subject: "TPS", topic: "Penalaran Umum",
    question: "Semua mahasiswa teknik bisa coding. Budi adalah mahasiswa teknik. Kesimpulan yang tepat adalah...",
    options: ["Budi tidak bisa coding", "Budi mungkin bisa coding", "Budi pasti bisa coding", "Budi adalah programmer", "Tidak dapat disimpulkan"],
    answer: 2, explanation: "Silogisme: Semua A adalah B. Budi adalah A. Maka Budi adalah B (bisa coding)."
  },
  {
    id: 2, subject: "TPS", topic: "Pengetahuan Kuantitatif",
    question: "Jika 3x + 7 = 22, maka nilai 2x - 1 adalah...",
    options: ["7", "8", "9", "10", "11"],
    answer: 2, explanation: "3x = 15, x = 5. Maka 2(5) - 1 = 9."
  },
  {
    id: 3, subject: "TPS", topic: "Literasi Bahasa Indonesia",
    question: "Kata 'kontradiksi' bermakna paling dekat dengan...",
    options: ["Persamaan", "Pertentangan", "Perpaduan", "Perbandingan", "Perubahan"],
    answer: 1, explanation: "Kontradiksi berasal dari kata Latin yang berarti pertentangan atau perlawanan."
  },
  {
    id: 4, subject: "TPS", topic: "Literasi Bahasa Inggris",
    question: "The word 'ambiguous' is closest in meaning to...",
    options: ["Clear", "Certain", "Unclear", "Obvious", "Direct"],
    answer: 2, explanation: "'Ambiguous' means open to multiple interpretations - unclear or doubtful."
  }
];

export const SUBJECTS_INFO = [
  { name: "TPS", full: "Tes Potensi Skolastik", iconName: "BrainCircuit", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", topics: ["Penalaran Umum", "Pengetahuan & Pemahaman Umum", "Kemampuan Memahami Bacaan & Menulis", "Pengetahuan Kuantitatif"] },
  { name: "Literasi", full: "Literasi Bahasa", iconName: "Languages", color: "text-success", bg: "bg-success/10", border: "border-success/20", topics: ["Literasi Bahasa Indonesia", "Literasi Bahasa Inggris"] },
  { name: "Penalaran Matematika", full: "Penalaran Matematika", iconName: "Sigma", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", topics: ["Aljabar", "Geometri", "Statistika", "Trigonometri"] },
];
