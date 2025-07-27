import { CheckIcon, XIcon } from "lucide-react";

// lib/validations/password.ts
export function checkPasswordStrength(password: string) {
    const hasMinLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
    const strengthScore = [
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;
  
    return {
      strengthScore,
      isStrong: strengthScore >= 4,
      feedback: {
        length: hasMinLength ? '✓' : 'Password too short',
        uppercase: hasUppercase ? '✓' : 'Missing uppercase',
        lowercase: hasLowercase ? '✓' : 'Missing lowercase',
        number: hasNumber ? '✓' : 'Missing number',
        specialChar: hasSpecialChar ? '✓' : 'Missing special character'
      }
    };
  }
  
  // React component to display strength meter
  export function PasswordStrengthMeter({ password }: { password: string }) {
    const { strengthScore, feedback } = checkPasswordStrength(password);
  
    return (
      <div className="space-y-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i <= strengthScore
                  ? i <= 2
                    ? 'bg-red-500'
                    : i <= 4
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {password && (
          <div className="text-xs text-muted-foreground grid grid-cols-2 gap-1">
            {Object.entries(feedback).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1">
                {value === '✓' ? (
                  <CheckIcon className="h-3 w-3 text-green-500" />
                ) : (
                  <XIcon className="h-3 w-3 text-red-500" />
                )}
                <span>{key}: {value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }