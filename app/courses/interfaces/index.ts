export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: string;
  tags: string[];
  stats: {
    modules: number;
    duration: string;
    rewards: number;
  };
  price: string;
  unit?: string;
}
