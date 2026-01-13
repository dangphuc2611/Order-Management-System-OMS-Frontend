import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/types/customer";

type Props = {
  customers: Customer[];
  value: string;
  onChange: (value: string) => void;
};

export function SelectField({ customers, value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select customer" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Customers</SelectLabel>

          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id.toString()}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
