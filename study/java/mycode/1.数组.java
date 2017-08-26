class a{

   public static void main(String args[]){
	   
	   //数组是放在栈里面的，堆里面只是放着指针
	   //所以打印出来的东西    [I@15db9742   
	   //            数组 int 分割线  指针代码    
		int[] arr={1,2,3};
		System.out.println(arr);	
		
		//数组定义方式
		//第一种
		int[] arr1 = new int[3];
		arr1[0]=1;arr1[1]=2;arr1[2]=3;
		//第二种
		int[] arr2 = new int[]{1,2,3};
		//第三种
		int[] arr3={1,2,3};
		
		
		System.out.println(arr1[0]);
		System.out.println(arr2[0]);
		System.out.println(arr3[0]);
		
		
		//数据循环
		for(int i=0;i<arr.length;i++){
			System.out.println(arr[i]);
		}
	}
}