// lib/validations/utils.ts
import { z } from 'zod';

// Client-side form validation helper
export async function validateForm<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): Promise<{ data?: T; errors?: Record<string, string> }> {
  try {
    const data = schema.parse(Object.fromEntries(formData));
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.flatten().fieldErrors;
      const formattedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [
          key,
          value?.join(', ') || ''
        ])
      );
      return { errors: formattedErrors };
    }
    throw error;
  }
}

// Server-side validation middleware
// export function withValidation(schema: z.ZodSchema) {
//   return async (req: NextRequest, next: () => Promise<NextResponse>) => {
//     try {
//       let data;
      
//       if (req.headers.get('content-type')?.includes('multipart/form-data')) {
//         const formData = await req.formData();
//         data = Object.fromEntries(formData);
//       } else {
//         data = await req.json();
//       }

//       schema.parse(data);
//       return next();
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           { error: 'Validation failed', details: error.flatten() },
//           { status: 400 }
//         );
//       }
//       return NextResponse.json(
//         { error: 'Invalid request' },
//         { status: 400 }
//       );
//     }
//   };
// }