package demo;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Vector;
import java.util.WeakHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FiveChessRoom {
	private static Logger logger = LoggerFactory.getLogger(FiveChessRoom.class);
	private String num;
	private Role nextPlayer = Role.getDefault();
	private List<Step> steps = new Vector<Step>();
	private Collection<Role> replayers = new HashSet<Role>(2);
	private WeakHashMap<Role, HashSet<Message>> messageMap = new WeakHashMap<Role, HashSet<Message>>();
	private Player playerA;
	private Player playerB;
	
	public FiveChessRoom() {
		this(null);
	}

	public FiveChessRoom(String roomNum) {
		setNum(roomNum);
		messageMap.put(Role.black, new HashSet<Message>());
		messageMap.put(Role.white, new HashSet<Message>());
	}
	
	public synchronized void addPlayer(Player player) {
		if (getPlayerA() == null) {
			setPlayerA(player);
		} else if (getPlayerB() == null) {
			player.setRole(Role.chooseOpponent(getPlayerA().getRole()));
			setPlayerB(player);
		}
		if (getPlayerA() != null && getPlayerB() != null) {
			getPlayerA().setOpponent(getPlayerB().getName());
			getPlayerB().setOpponent(getPlayerA().getName());
		}
	}

	public void reset() {
		resetPlayer();
		clearSteps();
		clearPlayers();
		clearReplayers();
	}

	public void replay(Role player) {
		add(getReplayers(), player);
		if (getReplayers().size() == Role.values().length) {
			replay();
		}
	}

	public void replay() {
		clearSteps();
		clearReplayers();
	}

	private void resetPlayer() {
		nextPlayer = Role.getDefault();
	}

	public void play(Role pa, String id) {
		if (id != null && id.contains("_")) {
			if (getNextPlayer().equals(pa)) {
				String index[] = id.split("_");
				getSteps().add(0, new Step(pa, Integer.parseInt(index[0]), Integer.parseInt(index[1])));
				switchPlayer();
			}
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private boolean add(Collection list, Object o) {
		try {
			if (!list.contains(o)) {
				list.add(o);
				return true;
			}
		} catch (Exception e) {
		}
		return false;
	}

	public void addMessage(Role p, String message) {
		HashSet<Message> msg = messageMap.get(p);
		msg.add(new Message(p.toString(), message));
	}

	private void switchPlayer() {
		nextPlayer = Role.chooseOpponent(nextPlayer);
	}

	public String getLastStep() {
		return getSteps().size() > 0 ? getSteps().get(0).toString() : "";
	}

	public HashSet<Message> getMessages(Role role) {
		HashSet<Message> msgs = messageMap.get(Role.chooseOpponent(role));
		for (Message m : msgs) {
			if (m.isSent()) {
				msgs.remove(m);
			} else {
				m.setSent(true);
			}
		}
		if (msgs.size() > 0) 
		logger.info("Return messages for {} with size {}", role, msgs.size());
		return msgs;
	}
	
	public HashSet<Message> getPlayerAMessages() {
		if (playerA != null) {
			return getMessages(playerA.getRole());
		}
		return null;
	}
	
	public HashSet<Message> getPlayerBMessages() {
		if (playerB != null) {
			return getMessages(playerB.getRole());
		}
		return null;
	}

	public List<Step> getSteps() {
		return steps;
	}

	private void clearSteps() {
		getSteps().clear();
	}

	private void clearPlayers() {
		setPlayerA(null);
		setPlayerB(null);
	}

	private void clearReplayers() {
		getReplayers().clear();
	}

	public Role getNextPlayer() {
		return nextPlayer;
	}

	public void setSteps(List<Step> steps) {
		this.steps = steps;
	}

	public Collection<Role> getReplayers() {
		return replayers;
	}

	public String getNum() {
		return num;
	}

	public void setNum(String num) {
		this.num = num;
	}

	public Player getPlayerA() {
		return playerA;
	}

	public void setPlayerA(Player playerA) {
		this.playerA = playerA;
	}

	public Player getPlayerB() {
		return playerB;
	}

	public void setPlayerB(Player playerB) {
		this.playerB = playerB;
	}
}

final class Step {

	private Role player = null;
	private int x;
	private int y;

	public Step(Role p, int x, int y) {
		this.player = p;
		this.x = x;
		this.y = y;
	}

	/**
	 * @return the nextPlayer
	 */
	public Role getPlayer() {
		return player;
	}

	/**
	 * @param nextPlayer
	 *            the nextPlayer to set
	 */
	public void setPlayer(Role player) {
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

}
