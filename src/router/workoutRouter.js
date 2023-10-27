const express = require("express");
const router = express.Router();
const axios = require("axios");
const { insertDocument, findDocumentsByFieldValue,updateDocumentById } = require("../database/db");

const bodyPart = [
  "back",
  "cardio",
  "chest",
  "lower arms",
  "lower legs",
  "neck",
  "shoulders",
  "upper arms",
  "upper legs",
  "waist",
];
router.get("/bodyPart/:workoutName", async (req, res) => {
  const exerciseCategory = req.params.workoutName;
  console.log(exerciseCategory, "this is category for this muscle group");

  const options = {
    method: "GET",
    url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${exerciseCategory}`,
    headers: {
      "X-RapidAPI-Key": "46e4a5d81fmsh0b1c24cb68c7f4dp18be3cjsnbaf581c22e5c",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send({ status: "Ok", data: response.data });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch exercises." });
  }
});
router.get("/exercises/:id", async (req, res) => {
  const exercise = req.params.id;
  console.log(exercise, "this is category for this muscle group");

  const options = {
    method: "GET",
    url: `https://exercisedb.p.rapidapi.com/exercises/exercise/${exercise}`,
    headers: {
      "X-RapidAPI-Key": "46e4a5d81fmsh0b1c24cb68c7f4dp18be3cjsnbaf581c22e5c",
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    res.send({ status: "Ok", data: response.data });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch exercises." });
  }
});

const target = [
  "abductors",
  "abs",
  "adductors",
  "biceps",
  "calves",
  "cardiovascular system",
  "delts",
  "forearms",
  "glutes",
  "hamstrings",
  "lats",
  "levator scapulae",
  "pectorals",
  "quads",
  "serratus anterior",
  "spine",
  "traps",
  "triceps",
  "upper back",
];
const categories = {
  back: ["spine", "upper back", "lats", "levator scapulae"],
  bicep: ["biceps", "forearms"],
  tricep: ["triceps"],
  shoulder: ["delts", "pectorals"],
  legs: ["abductors", "adductors", "calves", "hamstrings", "quads", "glutes"],
  chest: ["abs", "cardiovascular system", "serratus anterior"],
};
router.get("/target/:workoutName", async (req, res) => {
  const exerciseCategory = req.params.workoutName;
  const exerciseArray = [];

  if (categories.hasOwnProperty(exerciseCategory)) {
    const muscleGroups = categories[exerciseCategory];
    for (const category of muscleGroups) {
      console.log(category, "this is category for this muscle group");

      const options = {
        method: "GET",
        url: `https://exercisedb.p.rapidapi.com/exercises/target/${category}`,
        params: { limit: "10" },
        headers: {
          "X-RapidAPI-Key":
            "790e55a731msha0db3ffc5116a62p146a50jsna4961ac7f0e6",
          "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);

        exerciseArray.push(...response.data);
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Failed to fetch exercises." });
      }
    }

    res.json({ status: "Ok", data: exerciseArray });
  } else {
    res.status(400).json({ error: "Invalid workoutName." });
  }
});

router.get("/routine/:email", async (req, res) => {
  const email = req.params.email;
  console.log(email,'this is email',req.params);
  try {
    const data = await findDocumentsByFieldValue("Routine", "email", email);
    if(data.length===0){
    console.log('no routine found');
        res.send({ status: 200, data:null });

    } else{
      res.send({ status: 200, data: data });

    }
 

  } catch (err) {
    res.status(500).json({ error: "Error Getting data from collection" });
  }
});

router.post("/createRoutine", async (req, res) => {
  const request = req.body;
console.log(request);
  try {
    const insertCreatedRoutine = await insertDocument("Routine", request);
    if (insertCreatedRoutine === null) {
      return res.status(404).json({ error: "Error Adding Data To Database" });
    }
    res.send({ status: "Ok", data: "This is a Featch Request" });
  } catch (error) {
    res.status(401).send({ status: "Failed", data: error.message });
  }
});
router.post("/insertInExisitingRotuine", async (req, res) => {
  const request = req.body;
console.log(request);
const { routieneId, updatedWorkout,newWorkout } =  request
try {
    const findRoutineById = await updateDocumentById(
      "Routine",
      updatedWorkout[0]._id,
      updatedWorkout[0].workout
    );
    console.log(findRoutineById);
    const exerciseData = findRoutineById.exercises;
    exerciseData.append(request.exercises);
    
    res.send({ status: "Ok", data: "This is a Featch Request" });
  } catch (error) {
    console.log(error);
    
  }
});

router.post("/", (req, res) => {
  const { name } = req.body;
  console.log(name);
  // const product = await loginUser(req.body);
  // if (!product) {
  //   res.status(404).send({ status: "Failed", data: "User not found" });
  //   return;
  // }
  try {
    res.send({ status: "Ok", data: "This is a Featch Request" });
  } catch (error) {
    res.status(401).send({ status: "Failed", data: error.message });
  }
});

module.exports = router;
