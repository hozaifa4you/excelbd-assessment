import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const parcelTypes = [
   { value: 'document', label: 'Documents', icon: '📄' },
   { value: 'package', label: 'Package', icon: '📦' },
   { value: 'fragile', label: 'Fragile Items', icon: '🔸' },
   { value: 'electronics', label: 'Electronics', icon: '💻' },
   { value: 'clothing', label: 'Clothing', icon: '👕' },
   { value: 'food', label: 'Food Items', icon: '🍕' },
   { value: 'other', label: 'Other', icon: '📋' },
];

const ParcelDetails = () => {
   return (
      <div className="space-y-6">
         <div className="space-y-4">
            <Label className="text-base font-semibold">
               What are you shipping? *
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
               {parcelTypes.map((type) => (
                  <button
                     key={type.value}
                     type="button"
                     // onClick={() => updateFormData('parcelType', type.value)}
                     className={`rounded-xl border-2 p-4 text-center transition-all hover:scale-105 ${
                        // formData.parcelType === type.value
                        false
                           ? 'border-primary bg-primary/10 text-primary'
                           : 'border-border hover:border-primary/50'
                     }`}
                  >
                     <div className="mb-2 text-2xl">{type.icon}</div>
                     <div className="text-sm font-medium">{type.label}</div>
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
               <Label htmlFor="weight">Weight (kg) *</Label>
               <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="0.5"
                  className="h-12"
               />
            </div>
            <div className="space-y-2">
               <Label htmlFor="dimensions">Dimensions (L×W×H cm)</Label>
               <Input id="dimensions" placeholder="20×15×10" className="h-12" />
            </div>
         </div>

         <div className="space-y-4">
            <Label className="text-base font-semibold">Special Handling</Label>
            <div className="space-y-3">
               <div className="flex items-center space-x-2">
                  <Checkbox id="fragile" />
                  <Label
                     htmlFor="fragile"
                     className="flex items-center space-x-2"
                  >
                     <span>Fragile - Handle with care</span>
                     <Badge variant="secondary">+$2.99</Badge>
                  </Label>
               </div>
            </div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
               id="notes"
               placeholder="Any special delivery instructions..."
               className="min-h-[100px]"
            />
         </div>
      </div>
   );
};

export { ParcelDetails };
