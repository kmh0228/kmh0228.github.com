class a{

   public static void main(String args[]){
	   
	   //�����Ƿ���ջ����ģ�������ֻ�Ƿ���ָ��
	   //���Դ�ӡ�����Ķ���    [I@15db9742   
	   //            ���� int �ָ���  ָ�����    
		int[] arr={1,2,3};
		System.out.println(arr);	
		
		//���鶨�巽ʽ
		//��һ��
		int[] arr1 = new int[3];
		arr1[0]=1;arr1[1]=2;arr1[2]=3;
		//�ڶ���
		int[] arr2 = new int[]{1,2,3};
		//������
		int[] arr3={1,2,3};
		
		
		System.out.println(arr1[0]);
		System.out.println(arr2[0]);
		System.out.println(arr3[0]);
		
		
		//����ѭ��
		for(int i=0;i<arr.length;i++){
			System.out.println(arr[i]);
		}
	}
}