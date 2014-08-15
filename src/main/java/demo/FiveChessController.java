package demo;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

@RestController
@SessionAttributes(value = FiveChessController.USER_ATTR)
public class FiveChessController {
	public static final String USER_ATTR = "user";
	public static final String ROOMS_ATTR = "rooms";

	private static final Logger logger = LoggerFactory.getLogger(FiveChessController.class);

	@Autowired
	private ServletContext context;

	@PostConstruct
	public void init() {
		Map<String, FiveChessRoom> rooms = new LinkedHashMap<String, FiveChessRoom>();
		context.setAttribute(ROOMS_ATTR, rooms);
	}

	public boolean createRoom(String roomNum) {
		boolean res = false;
		if (!getRooms().containsKey(roomNum)) {
			logger.info("Create room with num: {}", roomNum);
			getRooms().put(roomNum, new FiveChessRoom(roomNum));
			res = true;
		} else {
			logger.info("Room exists room num: {}", roomNum);
		}
		this.getServletContext().setAttribute("roomKeys", getReversedRoomKeys());
		return res;
	}

	private ServletContext getServletContext() {
		return context;
	}

	public FiveChessRoom getRoom(String name) {
		return getRooms().get(name);
	}

	@SuppressWarnings("unchecked")
	public Map<String, FiveChessRoom> getRooms() {
		return (Map<String, FiveChessRoom>) this.getServletContext().getAttribute(ROOMS_ATTR);
	}
	
	@ModelAttribute("user")
	public Player createPlayer() {
		return new Player();
	}

	@RequestMapping(value = "/")
	public ModelAndView index(HttpSession session, @ModelAttribute("user") Player player) {
		player.setSessionId(session.getId());
		return new ModelAndView(ROOMS_ATTR);
	}

	@RequestMapping(value = "/admin")
	@ResponseBody
	public ModelAndView admin(@ModelAttribute(USER_ATTR) Player player) {
		player.setName("admin");
		return new ModelAndView(ROOMS_ATTR);
	}

	@RequestMapping(value = "/player")
	@ResponseBody
	public Player palyer(@ModelAttribute(USER_ATTR) Player player) {
		return player;
	}

	@RequestMapping(value = "/showRooms")
	public ModelAndView showRooms() {
		return new ModelAndView("showRooms");
	}
	
	private void updateUser(Player player) {
		FiveChessRoom room = getRoom(player.getRoomNum());
		if (room != null) {
			room.addPlayer(player);
			player.setNextPlayer(room.getNextPlayer());
		}
	}

	@RequestMapping(value = "/selectRoom/{roomNum}")
	public Player selectRoom(@PathVariable("roomNum") String roomNum, @ModelAttribute(USER_ATTR) Player player) {
		updateUser(player);
		player.setRoomNum(roomNum);
		return player;
	}

	@RequestMapping(value = "/play/{playId}")
	public Player play(@PathVariable("playId") String playId, @ModelAttribute(USER_ATTR) Player player) {
		FiveChessRoom room = getRoom(player.getRoomNum());
		logger.info("{} playing {}", player, playId);
		room.play(player.getRole(), playId);
		player.setNextPlayer(room.getNextPlayer());
		return player;
	}

	@RequestMapping(value = "/selectRole", method = RequestMethod.GET)
	public Player selectRole(@ModelAttribute(USER_ATTR) Player player) {
		logger.info("UserName {} role selecting {}", player.getName(), player.getRole());
		updateUser(player);
		logger.info(String.format("UserName %s role selected %s", player.getName(), player.getRole()));
		return player;
	}

	@RequestMapping(value = "/query/{roomNum}")
	public FiveChessRoom query(@PathVariable String roomNum) {
		FiveChessRoom room = getRoom(roomNum);
		return room;
	}

	@RequestMapping(value = "/requestReplay")
	public Collection<Role> requestReplay(@ModelAttribute(USER_ATTR) Player player) {
		FiveChessRoom room = getRoom(player.getRoomNum());
		room.replay(player.getRole());
		return room.getReplayers();
	}

	@RequestMapping(value = "/reset")
	public String reset() {
		this.getServletContext().setAttribute("roomKeys", getReversedRoomKeys());
		getRooms().clear();
		return "success";
	}

	@RequestMapping(value = "/sendMessage")
	public String sendMessage(@RequestParam String message, @ModelAttribute(USER_ATTR) Player player) {
		logger.info("receive message : {} from {}", message, player.getRole());
		FiveChessRoom room = getRoom(player.getRoomNum());
		if (!StringUtils.isEmpty(message)) {
			room.addMessage(player.getRole(), message);
		}
		return "success";
	}

	@RequestMapping(value = "/createRoom/{roomNum}")
	public String createRoomControl(@PathVariable String roomNum) {
		return "{'success':" + createRoom(roomNum) + "}";
	}

	private List<String> getReversedRoomKeys() {
		List<String> res = new ArrayList<String>();
		if (getRooms().size() > 0) {
			for (String key : getRooms().keySet()) {
				res.add(0, key);
			}
		}
		return res;
	}
}
