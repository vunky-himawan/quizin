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
import { useQuiz } from "@/context/quizContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const {
    generateQuestion,
    categories,
    difficulty,
    setDifficulty,
    generateCategories,
  } = useQuiz();
  const [selectedCategory, setSelectedCategory] = useState<number>(
    localStorage.getItem("X-CATEGORY-SELECTED")
      ? Number(localStorage.getItem("X-CATEGORY-SELECTED"))
      : 0
  );
  const [isPaused, setIsPaused] = useState<boolean>(
    localStorage.getItem("X-CATEGORY-SELECTED") ? true : false
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleStart = async (category: number) => {
    localStorage.setItem("X-CATEGORY-SELECTED", category.toString());
    setIsPaused(false);
    setSelectedCategory(category);
    if (!localStorage.getItem("X-Quiz-Questions")) {
      await generateQuestion(difficulty, category);
    }
    navigate("/user/quiz");
  };

  useEffect(() => {
    generateCategories();
  }, []);

  const handleResume = () => {
    setIsPaused(false);
    navigate("/user/quiz");
  };

  useEffect(() => {
    if (categories.length > 0) {
      setIsLoading(false);
    }
  }, [categories]);

  return (
    <>
      <main className="w-screen h-fit overflow-x-hidden relative flex flex-col p-5">
        <Header />
        <section className="max-w-7xl mx-auto h-full gap-5 w-full py-24 flex flex-col">
          {isLoading && (
            <div className="flex justify-center items-center h-full w-full">
              Loading...
            </div>
          )}
          {categories.length > 0 &&
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
                    <Button onClick={() => handleStart(category.id)}>
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

export default DashboardPage;
