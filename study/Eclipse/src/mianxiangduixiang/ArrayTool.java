package mianxiangduixiang;

/**
 * ����һ�����鷽������ �����ǲ���
 * @author ����
 * @version v1.0�汾
 * javadoc���Ի�ȥ�ļ�
 * egg  javadoc -d myhelp -author -version ArrayTool.java
 */

public class ArrayTool {
	/**
	 * ���鹤��
	 * @param ����
	 * @param ����
	 * @param ����
	 * @return ���ص�ֵ
	 */
	
	
	public static int max(int[] arr){
		int maxIndex=0;
		for(int i=1;i<arr.length;i++){
			if(arr[i]>arr[maxIndex]){
				maxIndex=i;
			}
		}
		return arr[maxIndex];
	}
}
