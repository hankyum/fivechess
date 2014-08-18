/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package demo;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author hank.guo
 */
public class Message {
    private Role player;
    private boolean sent;
    private String message;
    private Date time;
    private static DateFormat format = new SimpleDateFormat("hh:mm:ss");

    public Message() {
       
    }

    public Message(Role p, String message) {
        setPlayer(p);
        setMessage(message);
        setTime(new Date());
    }

    /**
     * @return the sent
     */
    public boolean isSent() {
        return sent;
    }

    /**
     * @param sent the sent to set
     */
	public void setSent(boolean sent) {
        this.sent = sent;
    }

    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * @return the time
     */
    public Date getTime() {
        return time;
    }

    /**
     * @param time the time to set
     */
    public void setTime(Date time) {
        this.time = time;
    }

    /**
     * @param player the player to set
     */
    public void setPlayer(Role player) {
        this.player = player;
    }

    /**
     * @return the player
     */
    public Role getPlayer() {
        return player;
    }


    public String formateTime() {
        return format.format(getTime());
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) return true;
        if (o instanceof Message) {
            Message m = (Message)o;
            return m.getTime().equals(this.getTime()) && m.getMessage().equals(getMessage())
                    && m.isSent() == this.isSent();
        }
        return false;
    }
}
