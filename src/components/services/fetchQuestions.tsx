import axios from "axios";

const baseURL = "https://opentdb.com/api.php?amount=";

export const getQuesionList = async (
  amount: number,
  difficulty: string
): Promise<any> => {
  try {
    const response = await axios.get(`${baseURL}${amount}&difficulty=${difficulty}&type=boolean`);
    return response.data.results;
  } catch (error) {
    throw new Error(`Error fetching the questions.${error}`);
  }
}
