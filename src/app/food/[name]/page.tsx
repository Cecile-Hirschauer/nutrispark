'use client'

// Import necessary components and hooks
import Image from 'next/image' // For displaying images
import { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import { IFood, IMacronutrientData } from "@/types"; // Import interfaces for food and macronutrient data
import { useRouter } from "next/navigation"; // Next.js router hook for navigation
import { Undo2 } from "lucide-react"; // Import undo icon from lucide-react

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; // Recharts components for pie chart


// FoodPage component
const FoodPage = ({ params }: { params: { name: string } }) => {
    const router = useRouter(); // Initialize router
    const [food, setFood] = useState<IFood | null>(null); // State for food data
    const [isLoading, setIsLoading] = useState<boolean>(true); // State for loading indicator
    const [macronutrients, setMacronutrients] = useState<IMacronutrientData[]>([]); // State for macronutrient data
    const COLORS = ['#F28907', '#5079F2', '#F2220F']; // Colors for pie chart segments

    // Function to fetch food data from the API
    const fetchFood = async () => {
        try {
            const APIQueryURL = `/api/foods/${params.name}`; // API endpoint
            const response = await fetch(APIQueryURL); // Fetch data from API
            const data = await response.json(); // Parse JSON response

            // Prepare macronutrient data
            const macronutrientsData: IMacronutrientData[] = [
                { name: 'carbohydrates', value: data.carbohydrates },
                { name: 'protein', value: data.protein },
                { name: 'fat', value: data.fat }
            ];
            setMacronutrients(macronutrientsData); // Update state with macronutrient data

            // Set food data
            setFood(data);
        } catch (error) {
            console.log(error); // Log any errors
        } finally {
            setIsLoading(false); // Set loading state to false
        }
    };

    // Effect to fetch food data on component mount
    useEffect(() => {
        const initialize = async () => {
            await fetchFood(); // Fetch food data
        };
        initialize(); // Call initialization function
    }, [params.name]); // Re-run effect if params.name changes

    return (
        <>
            {(!isLoading && food && macronutrients) ? (
                <div className={'p-8 text-white'}>
                    <Undo2 className={'cursor-pointer text-white mb-5'} onClick={() => router.back()}/>
                    <h1 className={'mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl'}>{food.name}</h1>
                    <div className={'flex flex-col md:flex-row items-center md:items-start'}>
                        <div className={'w-full md:w-1/2 lg:w-1/3 mb-8 md:mb-0'}>
                            <ResponsiveContainer width={'100%'} height={200}>
                                <PieChart>
                                    <Pie
                                        data={macronutrients}
                                        cx={'50%'}
                                        cy={'50%'}
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {macronutrients.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className={'mt-4 text-center'}>
                                <span className={'inline-block w-3 h-3 bg-[#F28907] mr-2'}></span>Carbohydrates
                                <span className={'inline-block w-3 h-3 bg-[#5079F2] mr-2 ml-4'}></span>Protein
                                <span className={'inline-block w-3 h-3 bg-[#F2220F] mr-2 ml-4'}></span>Fat
                            </div>
                        </div>
                        <div className={'w-full md:w-1/2 lg:w-2/3'}>
                            <div className={'text-lg font-semibold mb-4'}>Nutritional Information per 100 grams:</div>
                            <div className={'mb-4 p-4 text-white bg-gray-800 rounded-lg shadow-inner'}>
                                <div className={'mb-2'}>Calories: <span
                                    className={'font-medium'}>{food.calories} cal</span>
                                </div>
                                <div className={'flex items-center mb-2'}>
                                    <div className={'w-5 h-5 bg-[#F28907] border border-gray-700 mr-3'}></div>
                                    <div>Carbohydrates: <span
                                        className={'font-medium'}>{food.carbohydrates} g</span>
                                    </div>
                                </div>
                                <div className={'flex items-center mb-2'}>
                                    <div className={'w-5 h-5 bg-[#5079F2] border border-gray-700 mr-3'}></div>
                                    <div>Protein: <span
                                        className={'font-medium'}>{food.protein} g</span></div>
                                </div>
                                <div className={'flex items-center mb-2'}>
                                    <div className={'w-5 h-5 bg-[#F2220F] border border-gray-700 mr-3'}></div>
                                    <div>Fat: <span
                                        className={'font-medium'}>{food.fat} g</span></div>
                                </div>
                            </div>
                            <div className={'mt-4'}>
                                <div className={'flex items-center mb-2'}>
                                <Image src={'/vitamins.png'} width={30} height={30} alt={'vitamins'}/>
                                    <div className={'ml-3'}>
                                        <span className={'font-semibold'}> Vitamins: </span>
                                        {food.vitamins?.join(', ')}
                                    </div>
                                </div>
                                <div className={'flex items-center mb-2'}>
                                    <Image src={'/minerals.png'} width={30} height={30} alt={'minerals'}/>
                                    <div className={'ml-3'}>
                                        <span className={'font-semibold'}> Minerals: </span>
                                         {food.minerals?.join(', ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={'flex justify-center items-center h-screen text-white'}> {/* Loading state */}
                    <p className={'text-2xl'}>Loading...</p>
                </div>
            )
            }
        </>
    );
}

export default FoodPage