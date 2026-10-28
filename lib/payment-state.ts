export function paymentState(status?:string, issues=0){
 const value=status?.toUpperCase();
 if(value){
  if(["DENIED","FAILED","BLOCKED","RETURNED","CANCELED","REFUNDED"].includes(value))return {title:"Payout "+value.toLowerCase(),tone:"warning",description:"This payout did not complete successfully. Check the saved payment status and PayPal details before taking further action."};
  if(value==="RECONCILE")return {title:"Payout needs reconciliation",tone:"warning",description:"The payment outcome is uncertain. Check PayPal before attempting another payment."};
  if(value==="SIMULATED")return {title:"Payout simulated",tone:"pending",description:"This was a saved demonstration. No PayPal payment was sent."};
  if(value==="SUCCESS")return {title:"Payout batch completed",tone:"clear",description:"PayPal reports that the batch completed. Confirm individual payment outcomes in PayPal."};
  return {title:"Payout "+value.toLowerCase(),tone:"pending",description:"This payout has already been submitted. Check its status for the final result; do not submit it again."};
 }
 return {title:issues?"Hold this payment":"Ready for your approval",tone:issues?"warning":"clear",description:""};
}
