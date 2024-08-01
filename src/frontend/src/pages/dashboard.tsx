import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/ui/header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import { useQuiz } from "@/context/quizContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @component DashboardPage
 * @description Halaman dashboard untuk pengguna memulai atau melanjutkan kuis.
 * @returns {JSX.Element} - Halaman dashboard.
 */
const DashboardPage = () => {
  // Mengambil konteks autentikasi.
  const { username, refreshToken } = useAuth();

  // Mengambil konteks quiz.
  const {
    generateQuestion,
    setQuizQuestions,
    categories,
    difficulty,
    setDifficulty,
    generateCategories,
    quizError,
    setQuizError,
  } = useQuiz();

  // Mengambil dan menyimpan nilai selectedCategory dari localStorage.
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // Menyimpan nilai isStarted untuk disabled button.
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Mengambil dan menyimpan nilai isPaused dari localStorage.
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Mengambil dan menyimpan nilai isLoading dari localStorage.
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi fungsi untuk navigasi.
  const navigate = useNavigate();

  /**
   * @function handleStart
   * @description Fungsi untuk memulai kuis.
   * @param {number} category - Kategori kuis.
   */
  const handleStart = async (category: number) => {
    try {
      if (!localStorage.getItem(`X-Quiz-Questions-${username}`)) {
        await generateQuestion(difficulty, category);
      }

      setIsStarted(true);
      localStorage.setItem(
        `X-CATEGORY-SELECTED-${username}`,
        category.toString()
      );
      localStorage.setItem(`X-QUIZ-DIFFICULTY-${username}`, difficulty);
      setIsPaused(false);
      setSelectedCategory(category);

      toast({
        title: "Success generate questions",
        description: "Have fun taking the quiz, good luck!",
        duration: 2000,
        className: "bg-green-500 text-white",
      });

      navigate("/user/quiz");
    } catch (error) {
      setQuizError(error as string);
    }
  };

  /**
   * @function useEffect
   * @description Mengambil daftar kategori ketika komponen pertama kali di-render.
   */
  useEffect(() => {
    generateCategories();
  }, []);

  /**
   * @function handleResume
   * @description Fungsi untuk melanjutkan kuis.
   */
  const handleResume = () => {
    setIsPaused(false);
    setQuizQuestions(
      localStorage.getItem(`X-Quiz-Questions-${username}`)
        ? JSON.parse(
            localStorage.getItem(`X-Quiz-Questions-${username}`) as string
          )
        : []
    );

    navigate("/user/quiz");
  };

  /**
   * @function useEffect
   * @description Digunakan untuk menghilangkan loading ketika daftar kategori sudah di-render.
   */
  useEffect(() => {
    if (categories.length > 0) {
      setIsLoading(false);
    }
  }, [categories]);

  /**
   * @function useEffect
   * @description Digunakan untuk mengambil nilai difficulty, dan category dari localStorage ketika komponen pertama kali di-render untuk mengetahui apakah pengguna ada riwayat kuis yang belum selesai atau tidak.
   */
  useEffect(() => {
    if (username !== "") {
      setDifficulty(
        localStorage.getItem(`X-QUIZ-DIFFICULTY-${username}`) ?? ""
      );
      setIsPaused(
        localStorage.getItem(`X-CATEGORY-SELECTED-${username}`) ? true : false
      );
      setSelectedCategory(
        localStorage.getItem(`X-CATEGORY-SELECTED-${username}`)
          ? Number(localStorage.getItem(`X-CATEGORY-SELECTED-${username}`))
          : 0
      );
    }
  }, [username]);

  useEffect(() => {
    if (quizError !== "") {
      toast({
        title: "Error",
        description: quizError,
        duration: 2000,
        variant: "destructive",
      });
    }
  }, [quizError]);

  /**
   * @function useEffect
   * @description Digunakan untuk menunggu sampai username tersedia.
   */
  useEffect(() => {
    const initialize = async () => {
      await refreshToken();
      setIsLoading(false);
    };

    initialize();
  }, [refreshToken]);

  return (
    <>
      <main className="h-fit overflow-x-hidden relative flex flex-col p-5">
        <Header />
        <section className="max-w-7xl mx-auto h-full gap-5 w-full py-24 flex flex-col">
          {isLoading && <DashboardSkeleton />}
          {categories.length > 0 &&
            username !== "" &&
            categories.map((category) => (
              <Dialog key={category.id}>
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quis, suscipit?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-5 items-center">
                      <DialogTrigger asChild>
                        <Button disabled={isPaused}>Start Quiz</Button>
                      </DialogTrigger>
                      {selectedCategory === category.id && (
                        <DialogTrigger asChild>
                          <Button onClick={handleResume}>Resume Quiz</Button>
                        </DialogTrigger>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Difficulty</DialogTitle>
                  </DialogHeader>
                  <Select
                    name="difficulty"
                    onValueChange={(e) => setDifficulty(e)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <DialogFooter>
                    <Button
                      disabled={difficulty === "" || isStarted}
                      onClick={() => handleStart(category.id)}
                    >
                      Confirm
                    </Button>
                    <DialogClose>Cancel</DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
        </section>
      </main>
    </>
  );
};

/**
 * @component DashboardSkeleton
 * @description Component untuk menampilkan skeleton untuk halaman dashboard ketika loading.
 * @returns {JSX.Element} - Mengembalikan skeleton untuk halaman dashboard.
 */
const DashboardSkeleton = () => {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 flex justify-center items-center overflow-hidden z-10">
      <div className="max-w-7xl mx-auto h-full gap-5 w-full py-24 flex flex-col">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

/**
 * @component SkeletonCard
 * @description Component untuk menampilkan skeleton untuk card.
 * @returns {JSX.Element} - Mengembalikan skeleton untuk card.
 */
const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-5 w-full border p-5 rounded-lg">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[250px]" />
        <Skeleton className="h-5 w-[180px]" />
      </div>
      <div className="flex gap-5 items-center">
        <Skeleton className="h-7 w-[80px]" />
      </div>
    </div>
  );
};

export default DashboardPage;
