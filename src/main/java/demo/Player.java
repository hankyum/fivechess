package demo;

public class Player {
	private String opponent;
	private String name;
	private Role role = Role.getDefault();
	private String roomNum;
	private Role nextPlayer;
	private String sessionId;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getOpponent() {
		return opponent;
	}

	public void setOpponent(String opponent) {
		this.opponent = opponent;
	}

	public String getRoomNum() {
		return roomNum;
	}

	public void setRoomNum(String roomNum) {
		this.roomNum = roomNum;
	}

	public Role getNextPlayer() {
		return nextPlayer;
	}

	public void setNextPlayer(Role nextPlayer) {
		this.nextPlayer = nextPlayer;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
}
