package javaCode;

public class Arr {
	public static void main (String[] args){
		//System.out.print("relay,go");
		
		//0503
			//找出数组的最大值
			int[] arr={1,2,3,5};
			
			int arrMax=arr[0];
			for(int i=1;i<arr.length;i++){
				if(arr[i]>arrMax){
					arrMax=arr[i];
				}
			}

			//System.out.println(arrMax);
		
		//二维数组定义
			int[][] arr2=new int[3][2];
			
			System.out.println(arr2[0][0]);
		
			
			int[][] arr3=new int[3][];
			arr3[0]=new int[2];
			arr3[1]=new int[3];
			arr3[2]=new int[4];
			System.out.println(arr3[2][3]);
			System.out.println(arr3);
			System.out.println(arr3[2].length);
			
			int[][] arr4={{1,2,3},{4,5,8},{6,9,5}};
			System.out.println(arr4[1][2]);
			
		
		
		
		
		
		
		
	}
	
}
