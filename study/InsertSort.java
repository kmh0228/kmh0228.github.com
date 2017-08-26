package com.raysdata.utils;

import org.apache.avro.generic.GenericData;

import java.util.Map;

public class InsertSort {

	
	
										//站点                        红绿灯
    public static String InsertSort(String[] arr1, String[] arr2){
        //线路代码，上下行，站点ID，经度，纬度，序号
        //所有有红绿灯的路口
        //线路ID，上下行，路口ID ，经度，纬度，序号
        String aux="";
        int i=0;

        int j=arr1.length;
        int mid=arr1.length-1;
        int len=arr1.length+arr2.length;
        String[] a=new String[len];
        
        //arr[i].lng  arr[i].lat
        
        for(int k=0;k<len;k++){

            if(k<arr1.length)
                a[k]=arr1[k];
            else
                a[k]=arr2[k-arr1.length];
          //  System.out.println(a[k]);
        }
        int m=0;
        for(int k=0;k<len;k++){
//            if(i>mid) aux+=a[j++]+",,,";
//            else if(j>len) aux+=a[i++]+",,,";
//            else if(Double.valueOf(a[j])<Double.valueOf(a[i])) aux+=a[j++]+",,,";
//            else aux+=a[i++]+",,,";
            m=m+1;

            if(i>mid) {
//                aux+=a[j].split(",")[0]+","+a[j].split(",")[1]+","+a[j].split(",")[2]+","+a[j].split(",")[5]+","+m+",,,";
                aux+=a[j].split(",")[3]+","+a[j].split(",")[4]+",";
                j++;
            }
           else if(j>len){
//                aux+=a[i].split(",")[0]+","+a[i].split(",")[1]+","+a[i].split(",")[2]+","+"3,"+m+",,,";
               aux+=a[i].split(",")[3]+","+a[i].split(",")[4]+",";
                i++;
            }
           else if(j<len&&inline(Double.valueOf(a[i].split(",")[3]),Double.valueOf(a[i].split(",")[4]),Double.valueOf(a[i+1].split(",")[3]),Double.valueOf(a[i+1].split(",")[4]),Double.valueOf(a[j].split(",")[3]),Double.valueOf(a[j].split(",")[4]))==0
                    &&inline(Double.valueOf(a[j].split(",")[3]),Double.valueOf(a[j].split(",")[4]),Double.valueOf(a[j+1].split(",")[3]),Double.valueOf(a[j+1].split(",")[4]),Double.valueOf(a[i].split(",")[3]),Double.valueOf(a[i].split(",")[4]))==1)
            {
//                aux+=a[j].split(",")[0]+","+a[j].split(",")[1]+","+a[j].split(",")[2]+","+a[j].split(",")[5]+","+m+",,,";
                aux+=a[j].split(",")[3]+","+a[j].split(",")[4]+",";
            j++;}
              //a[j]代表当前路口，a[i]代表当前站点
          // int a= inline(Double.valueOf(a[i-1].split(",")(3)),Double.valueOf(a[i-1].split(",")(4)),Double.valueOf(a[i].split(",")(3)),Double.valueOf(a[i].split(",")(4)),Double.valueOf(a[j].split(",")(3)),Double.valueOf(a[j].split(",")(4)));
           else {
               if(j<len&&inline(Double.valueOf(a[j].split(",")[3]),Double.valueOf(a[j].split(",")[4]),Double.valueOf(a[j+1].split(",")[3]),Double.valueOf(a[j+1].split(",")[4]),Double.valueOf(a[i].split(",")[3]),Double.valueOf(a[i].split(",")[4]))==1)
               {
                   System.out.println("enen");
                   // aux+=a[j].split(",")[0]+","+a[j].split(",")[1]+","+a[j].split(",")[2]+","+a[j].split(",")[5]+","+m+",,,";
                   aux+=a[j].split(",")[3]+","+a[j].split(",")[4]+",";
                   j++;}
               else{
                   //  aux+=a[i].split(",")[0]+","+a[i].split(",")[1]+","+a[i].split(",")[2]+","+"3,"+m+",,,";
                   aux+=a[i].split(",")[3]+","+a[i].split(",")[4]+",";
                   i++;}
            }

            System.out.println(aux);

        }
       return  aux;
    }

    public static String[] sort(String[] a,int i,int len){

        int mid=i+(len-i)/2-1;
        int j=mid;
        String[] aux={};
        String[] sortlift={};
        String[] sortright={};
        if(mid>0){

           sortlift=sort(a,0,mid);
           sortright=sort(a,j,len);
        }
        for(int k=0;k<len;k++){


            if(k<sortlift.length)
                a[k]=sortlift[k];
            else
                a[k]=sortright[k-sortlift.length];
        }
        for(int k=0;k<len;k++)

    {
            if(i>mid) a[k]=aux[j++];
            else if(j>len) a[k]=aux[i++];
            else if(Double.valueOf(a[j])<Double.valueOf(a[i])) a[k]=aux[j++];
            else a[k]=aux[i++];
    }
       return a;
    }


    public static int  inline(double x1, double y1, double x2, double y2, double x,double y){
        int b;
        double cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1);
        double d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        double r = cross / d2;

        if (r >= 0 )//在线上
            b=1;
        else         //不在线上
            b=0;
        return b;
    }


    public static void main(String[]args){
        String[] a={"22940,1,556225934,1,1","22940,1,556225933,3,1","22940,1,556225932,2,0"};
        String[] b={"22940,1,298707,0,1","22940,1,300315,2,1","22940,1,245531,4,1","22940,1,245531,4,2","22940,1,245531,5,3","22940,1,245531,3,4","22940,1,245531,2,4"};
        String[] c={"4","5","3","7","9","2"};
        System.out.println(InsertSort(a,b));

    }
}
