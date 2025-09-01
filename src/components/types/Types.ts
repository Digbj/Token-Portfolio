export interface ChartData {
    id: string;
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: ChartData[];
}
// export interface Coin {
//   id: string;
//   image: string;
//   name: string;
//   color?: string;
//   ath_change_percentage?: number;
//   value?: number;
//   symbol?:string;
//   price_24h:string;  
//   Sparkline:[];
//   Holdings:string;
//   Value:string;
// }

export interface Coin {
  id: string;
  image: string;
  name: string;
  color?: string;
  ath_change_percentage?: number;
  value?: number;
  symbol?: string;
  price_24h: string;
  Sparkline: number[];
  Holdings: string;
  Value: string;
}


export type SparkLineProps = {
  data?: number[];
  className?: string;
};