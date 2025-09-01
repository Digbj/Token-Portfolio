import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import type { DonutChartProps } from "../types/Types";
 
 export const DonutChart: React.FC<DonutChartProps> = ({ data }: DonutChartProps) => {
    // console.log("DonutChart data:", data);
   return (
     <div className="w-full md:w-2/3 h-[200px]">
       <ResponsiveContainer>
         <PieChart>
           <Pie
             data={data}
             cx="50%"
             cy="50%"
             innerRadius={60}
             outerRadius={90}
             paddingAngle={0}
             dataKey="value"
           >
             {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={entry.color} />
             ))}
           </Pie>
         </PieChart>
       </ResponsiveContainer>
     </div>
   );
 };
