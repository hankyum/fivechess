package demo;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Vector;
import java.util.WeakHashMap;

/**
 *
 * @author hguo
 */
public class FiveChessRoom {
    // The one who can play next

    private Player nextPlayer = Player.white;
    // Each step made my palyer
    private List<Step> steps = new Vector<Step>();
    // who are playing session_id => player
    private Hashtable<String, Player> livePlayersMap = new Hashtable<String, Player>();
    // Who request to replay
    private List<Player> replayers = new ArrayList<Player>(2);

    private WeakHashMap<Player, HashSet<Message>> messageMap = new WeakHashMap<Player, HashSet<Message>>();
    // Valid roles in this game
    public static List<Player> ROLES = new ArrayList<Player>(2);

    static {
        ROLES.add(Player.white);
        ROLES.add(Player.black);
        Collections.unmodifiableCollection(ROLES);
    }

    public FiveChessRoom() {
        messageMap.put(Player.black, new HashSet<Message>());
        messageMap.put(Player.white, new HashSet<Message>());
    }

    public void reset() {
        resetPlayer();
        clearSteps();
        clearPlayers();
        clearReplayers();
    }

    public void replay(Player player) {
        add(getReplayers(), player);
        if (getReplayers().size() == ROLES.size()) {
            replay();
        }
    }

    public void replay() {
        clearSteps();
        clearReplayers();
    }

    private void resetPlayer() {
        nextPlayer = Player.white;
    }

    public void play(Player pa, String id) {
        if (id != null && id.contains("_")) {
            if (getNextPlayer().equals(pa)) {
                String index[] = id.split("_");
                getSteps().add(0, new Step(pa, Integer.parseInt(index[0]),
                        Integer.parseInt(index[1])));
                switchPlayer();
            }
        }
    }

    public boolean add(List list, Object o) {
        try {
            if (!list.contains(o)) {
                list.add(o);
                return true;
            }
        } catch (Exception e) {
        }
        return false;
    }

    public Player getPlayer(String sessionId) {
        return livePlayersMap.get(sessionId);
    }

    public boolean addPlayer(String sessionId, Player p) {
        if (livePlayersMap.containsKey(sessionId)) return true;
        if (livePlayersMap.size() < ROLES.size()) {
            livePlayersMap.put(sessionId, p);
            return true;
        } 
        return false;
    }

    public void addMessage(Player p, String message) {
        HashSet<Message> msg = getMessageMap().get(p);
        msg.add(new Message(p.toString(), message));
    }

    private void switchPlayer() {
        if (getNextPlayer() == Player.black) {
            setNextPlayer(Player.white);
        } else {
            setNextPlayer(Player.black);
        }
    }

    public String getLastStep() {
        return getSteps().size() > 0 ? getSteps().get(0).toString() : "";
    }

    /**
     * @return the nextPlayer
     */
    public Player getNextPlayer() {
        return nextPlayer;
    }

    /**
     * @param nextPlayer the nextPlayer to set
     */
    private void setNextPlayer(Player player) {
        this.nextPlayer = player;
    }

    /**
     * @return the livePlayersMap
     */
    public Collection<Player> getPlayers() {
        return livePlayersMap.values();
    }

    public String getSessionIdString() {
        return livePlayersMap.keySet().toString();
    }

    public int getPlayersSize() {
        return getPlayers().size();
    }

    public int getRolesSize() {
        return ROLES.size();
    }

    public String getJSONSteps() {
        return toJSON(getSteps());
    }

    /**
     * @return the livePlayersMap
     */
    public String getJSONPlayers() {
        return toJSON(getPlayers());
    }

    /**
     * @return the livePlayersMap
     */
    public String getJSONReplayRequesters() {
        return toJSON(getReplayers());
    }

    private String toJSON(Collection list) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (Object o : list) {
            boolean needComma = o instanceof Player || o.getClass().isPrimitive();
            if (needComma) {
                sb.append("'");
            }
            sb.append(o.toString());
            if (needComma) {
                sb.append("'");
            }
            sb.append(",");
        }
        sb.append("]");
        return sb.toString().replaceAll(",]", "]");
    }

    public String getMessages(Player p) {
        if (!ROLES.contains(p)) return "[]";
        if (p == Player.black) {
            p = Player.white;
        } else if (p == Player.white) {
             p = Player.black;
        }
        HashSet<Message> msgs = getMessageMap().get(p);
        String res = toJSON(msgs);
        for (Message m : msgs) {
            if (m.isSent()) {
                msgs.remove(m);
            }
        }
        return res;
    }

    /**
     * @return the replayRequests
     */
    public List<Player> getReplayers() {
        return replayers;
    }

    /**
     * @return the steps
     */
    public List<Step> getSteps() {
        return steps;
    }

    private void clearSteps() {
        getSteps().clear();
    }

    private void clearPlayers() {
        livePlayersMap.clear();
    }

    private void clearReplayers() {
        getReplayers().clear();
    }

    /**
     * @return the messageMap
     */
    public WeakHashMap<Player, HashSet<Message>> getMessageMap() {
        return messageMap;
    }

    /**
     * @param messageMap the messageMap to set
     */
    public void setMessageMap(WeakHashMap<Player, HashSet<Message>> messageMap) {
        this.messageMap = messageMap;
    }
}

final class Step {

    private Player player = null;
    private int x;
    private int y;

    public Step(Player p, int x, int y) {
        this.player = p;
        this.x = x;
        this.y = y;
    }

    /**
     * @return the nextPlayer
     */
    public Player getPlayer() {
        return player;
    }

    /**
     * @param nextPlayer the nextPlayer to set
     */
    public void setPlayer(Player player) {
        this.player = player;
    }

    /**
     * @return the x
     */
    public int getX() {
        return x;
    }

    /**
     * @return the y
     */
    public int getY() {
        return y;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{'player':'").append(getPlayer().toString().toLowerCase()).append("','playId':'").append(getX() + "_" + getY()).append("'}");
        return sb.toString();
    }
}

enum Player {

    wait,
    white,
    black;
}
