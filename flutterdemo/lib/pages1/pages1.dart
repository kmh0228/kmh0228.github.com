import 'package:flutter/material.dart';

class Pages1 extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Container(
        width:200,
        height:200,
        color: Colors.blue,
        margin: EdgeInsets.all(20),
        padding: EdgeInsets.all(20),
        child:Text(
          'container neirong',
          style: TextStyle(
            color:Colors.red
          ),
        ),
      );
    }
}