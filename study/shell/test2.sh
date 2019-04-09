youname=(str1 str2 str3 str4)
youname[6]=str5
echo ${#youname[@]}-${#youname[*]}-${#youname[1]}
