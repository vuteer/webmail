import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface TextInputProps {
  className?: string;
  form?: any;
  name: string;
  loading?: boolean;
  placeholder?: string | number;
  type?: string;
  textarea?: boolean;
  subtitle?: string; 
  // file?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  className = "",
  form,
  name,
  loading,
  placeholder = "Type here...",
  type = "text",
  textarea = false,
  subtitle
  // file = false,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }: { field: any }) => (
        <FormItem className={`my-4 ${className && className}`}>
          <FormLabel className={name === "cc" ? "uppercase": "capitalize"}>
            {name?.replace("_", " ")}
          </FormLabel>
          {subtitle && <span className="block text-sm text-main font-bold">{subtitle}</span>}
          <FormControl>
            <>
              {/* {
                                file && (
                                    <ImageUpload 
                                        disabled={loading}
                                        onChange={(url: string) => {
                                            const updatedValue = [...field.value, url]; 
                                            field.onChange(updatedValue);
                                        }}
                                        onRemove={(url: string) => {
                                            const updatedValue = field.value.filter((imageUrl: string) => imageUrl !== url);
                                            field.onChange(updatedValue);
                                        }}
                                        path={process.env.NODE_ENV === 'production' ? `/blog`: '/test/blogs'}
                                        images={field.value}
                                    />
                                )
                            }  */}
              {textarea && (
                <Textarea
                  className="focus:border-active-color focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                  placeholder={String(placeholder)}
                  {...field}
                />
              )}
              {!textarea && (
                <Input
                  className="focus:border-active-color focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                  placeholder={String(placeholder)}
                  type={type || "text"}
                  {...field}
                />
              )}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextInput;
