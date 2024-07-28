import { seedQuestions } from "./QuestionSeeder";
import { seedUsers } from "./UserSeeder";

const runSeeders = async () => {
  await seedQuestions();
  await seedUsers();

  console.log("All seeders have been executed");
};

runSeeders()
  .catch(console.error)
  .finally(() => process.exit());
