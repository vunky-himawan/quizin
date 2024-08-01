/**
 * @component QuizLayout
 * @description Layout untuk halaman quiz.
 * @param {React.ReactNode} children - Konten yang akan ditampilkan di dalam layout.
 * @returns {JSX.Element} - Mengembalikan halaman yang akan ditampilkan sesuai dengan action.
 */
const QuizLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="w-screen h-fit">
        <section className="max-w-7xl mx-auto h-full gap-5 w-full pt-24 p-5 grid grid-cols-5">
          {children}
        </section>
      </main>
    </>
  );
};

export default QuizLayout;
