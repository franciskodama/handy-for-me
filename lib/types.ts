export type SpinList = {
  uid: string;
  id: string;
  name: string;
  createdAt: Date;
  items: SpinItem[];
};

export type SpinItem = {
  uid: string;
  id: string;
  createdAt: Date;
  listId: string;
  name: string;
  selected: boolean;
};

// export type RandomQuestionList = {
//   id: string;
//   name: string;
//   createdAt: Date;
//   questions: RandomQuestions[];
// }

// export type RandomQuestions = {
// id: string;
// question: string;
// listId: string;
// createdAt: Date;
// }
