"use client"

// Import necessary types and components
import {IFoodReduced, IFood} from "@/types"; // Import interfaces for food data
import {Check, ChevronsUpDown} from "lucide-react" // Import icons from lucide-react
import {cn} from "@/lib/utils" // Import utility function for class names
import {Button} from "@/components/ui/button" // Import Button component
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command" // Import Command components for the search interface
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover" // Import Popover components for the dropdown
import {useEffect, useState} from "react"; // Import React hooks
import {useRouter} from "next/navigation"; // Import Next.js router hook

// Main component
export default function Home() {
    // State variables
    const [open, setOpen] = useState(false) // Control popover open state
    const [value, setValue] = useState(""); // Store selected food value
    const [foods, setFoods] = useState<IFoodReduced[]>([]); // Store list of food items
    const [isLoading, setIsLoading] = useState<boolean>(true); // Control loading state

    const router = useRouter(); // Initialize router

    // Function to fetch food data from the API
    const fetchFood = async () => {
        try {
            const response = await fetch('/api/foods/all'); // Fetch data from API
            const data = await response.json(); // Parse JSON response
            const foodReduced: IFoodReduced[] = data.map((food: IFood) => ({
                value: food.name.toLowerCase().replace(/ /g, '-'), // Format value for URL
                label: food.name // Use food name as label
            }));
            setFoods(foodReduced); // Update state with fetched data
        } catch (error) {
            console.log(error) // Log any errors
        }
    };

    // Effect to fetch food data on component mount
    useEffect(() => {
        const initialize = async () => {
            await fetchFood(); // Fetch food data
            setIsLoading(false); // Set loading state to false
        };
        initialize(); // Call initialization function
    }, []);

    // Effect to navigate to food detail page when value changes
    useEffect(() => {
        if (value.length > 0) {
            router.push(`/food/${value}`); // Navigate to selected food page
        }
    }, [value]);

    return (
        <>
            {!isLoading ? ( // Render main content when not loading
                <div className={'min-h-screen text-white flex flex-col items-center justify-center p-6'}>
                    <h1 className={'text-5xl font-extrabold mb-4'}>
                        Welcome to <span className={'title_colored'}>NutriSpark</span>
                    </h1>
                    <p className="text-lg mb-8 text-center max-width-2xl">
                        Discover the nutritional values of your favorite foods.
                        Use the search below to get started.
                    </p>
                    <Popover open={open} onOpenChange={setOpen}> {/* Popover component */}
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[300px] justify-between"
                            >
                                {value
                                    ? foods.find((food) => food.value === value)?.label // Display selected food label
                                    : "Select foods..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/> {/* Icon */}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command> {/* Command component for search functionality */}
                                <CommandInput placeholder="Search food..."/> {/* Search input */}
                                <CommandList>
                                    <CommandEmpty>No food found.</CommandEmpty> {/* Empty state */}
                                    <CommandGroup>
                                        {foods.map((food) => (
                                            <CommandItem
                                                key={food.value}
                                                value={food.value}
                                                onSelect={(currentValue) => {
                                                    setValue(currentValue === value ? "" : currentValue) // Update selected value
                                                    setOpen(false) // Close popover
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === food.value ? "opacity-100" : "opacity-0" // Show check icon if selected
                                                    )}
                                                />
                                                {food.label} {/* Display food label */}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : (
                <div className={'flex justify-center items-center h-screen text-white'}> {/* Loading state */}
                    <p className={'text-2xl'}>Loading...</p>
                </div>
            )}
        </>
    );
}
