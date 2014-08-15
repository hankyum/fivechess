package demo;

public enum Role {
    white,
    black;
    
   public static Role chooseOpponent(Role p) {
    	if (white == p) {
    		return black;
    	} else {
    		return white;
    	}
    }
   
   public static boolean isPlayable(Role p) {
	   if (p == white || p == black) {
		   return true;
	   }
	   return false;
   }
   
   public static Role getDefault() {
	   return white;
   }
   
}
