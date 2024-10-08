import { z } from 'zod';

const addExerciseSchema = z.object({
  name: z.string().nonempty(),
  sets: z.coerce.number().min(0),
  reps: z.coerce.number().min(0),
  weight: z.coerce.number().min(0),
});

export type AddExerciseSchema = z.infer<typeof addExerciseSchema>;

export { addExerciseSchema };
