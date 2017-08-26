package mianxiangduixiang;

/**
 * 这是一个数组方法工具 以下是参数
 * @author 作者
 * @version v1.0版本
 * javadoc可以或去文件
 * egg  javadoc -d myhelp -author -version ArrayTool.java
 */

public class ArrayTool {
	/**
	 * 数组工具
	 * @param 参数
	 * @param 参数
	 * @param 参数
	 * @return 返回的值
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
