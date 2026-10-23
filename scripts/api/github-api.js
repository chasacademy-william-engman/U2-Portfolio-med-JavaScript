export default async function getRepo() {
  try {
    const response = await fetch(
      "https://api.github.com/users/chasacademy-william-engman/repos",
    );

    if (!response.ok) {
      throw new Error("Error Github API:", response.error);
    }

    const result = JSON.parse(response);
    return result;
  } catch (error) {
    console.log(error.message);
  }
}
