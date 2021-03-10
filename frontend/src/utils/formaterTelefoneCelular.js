export default function formatPhoneNumber(phoneNumberString) {
  phoneNumberString = phoneNumberString.replace("(","").replace(")","").replace("-","");
  phoneNumberString = phoneNumberString.trim();
  var cleaned = phoneNumberString.split('');
  if(cleaned.length === 1){
    return phoneNumberString;
  }else if(cleaned.length > 1 && cleaned.length < 3){
    return '(' + cleaned[0]+cleaned[1] + ') '
  }else if(cleaned.length === 8){
    return '(' + cleaned[0]+cleaned[1] + ')'+ cleaned[2]+cleaned[3]+ cleaned[4]+cleaned[5]+cleaned[6]+'-'+cleaned[7];
  }else if(cleaned.length === 12){
    return '(' + cleaned[0]+cleaned[1] + ')'+ cleaned[2]+ cleaned[3]+ " " +cleaned[4]+cleaned[5]+cleaned[6]+cleaned[7]+'-'+cleaned[8]
    +cleaned[9]+cleaned[10]+cleaned[11];
  }
}