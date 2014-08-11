package demo;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author hguo
 */
public class FiveChessServlet extends HttpServlet {

    public static final class Param {

        private static final String METHOD = "method";
        private static final String PLAY_ID = "playId";
        private static final String ROLE = "role";
        private static final String ROOM = "room";
        private static final String ROOMS = "rooms";
        private static String MESSAGE = "message";

        /**
         * @return the METHOD
         */
        public static String getMETHOD() {
            return METHOD;
        }

        /**
         * @return the PLAY_ID
         */
        public static String getPLAY_ID() {
            return PLAY_ID;
        }

        /**
         * @return the ROLE
         */
        public static String getROLE() {
            return ROLE;
        }

        /**
         * @return the ROOM
         */
        public static String getROOM() {
            return ROOM;
        }

        public static boolean isEmpty(String str) {
            return str == null || str.isEmpty() || "null".equalsIgnoreCase(str);
        }
    }
    private ServletContext context;

    @Override
    public void init() {
        context = this.getServletContext();
        Map<String, FiveChessRoom> rooms = new LinkedHashMap<String, FiveChessRoom>();
        context.setAttribute(Param.ROOMS, rooms);
    }

    public boolean createRoom(String name) {
        boolean res = false;
        if (!getRooms().containsKey(name)) {
            getRooms().put(name, new FiveChessRoom());
            res = true;
        }
        this.getServletContext().setAttribute("roomKeys", getReversedRoomKeys());
        return res;
    }

    public FiveChessRoom getRoom(String name) {
        return getRooms().get(name);
    }

    public Map<String, FiveChessRoom> getRooms() {
        return (Map<String, FiveChessRoom>) this.getServletContext().getAttribute(Param.ROOMS);
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @SuppressWarnings("element-type-mismatch")
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Cache-Control", "max-age=0, no-cache");
        // HTTP 1.0
        response.setHeader("Pragma", "no-cache");
        // Prevents caching at the proxy server
        response.setDateHeader("Expires", -1);
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            String method = request.getParameter(Param.METHOD);
            String room = request.getParameter(Param.ROOM);
            String role = request.getParameter(Param.ROLE);
            String playId = request.getParameter(Param.PLAY_ID);
            String message = request.getParameter(Param.MESSAGE);
            HttpSession session = request.getSession();
            FiveChessRoom chess = getRoom(room);
            Operation op = Operation.valueOf(method);
            // Get the player from the room first;
            Player p = chess != null ? chess.getPlayer(session.getId()) : null;
            request.setAttribute("SESSION_ID", session.getId());
            if (Param.isEmpty(role)) {
                Object attr = session.getAttribute(Param.ROLE);
                role = attr != null ? attr.toString() : "";
            }
            if (p == null) {
                p = createPlayer(role);
            } else {
                role = p.toString();
            }

            if (Operation.reset.equals(op)) {
                this.getServletContext().setAttribute("roomKeys", getReversedRoomKeys());
                getRooms().clear();
                return;
            }

            if (Operation.query.equals(op) && chess != null) {
                StringBuilder sb = new StringBuilder();
                sb.append("{'steps':").append(chess.getJSONSteps()).append(",'players':").append(chess.getJSONPlayers()).append(",'player':'").append(chess.getNextPlayer().toString().toLowerCase()).append("','role':'").append(role).append("','replayers':").append(chess.getJSONReplayRequesters()).append(", 'messages':").append(chess.getMessages(p)).append("}");
                out.write(sb.toString());
                return;
            }

            if (Operation.selectRole.equals(op) && p != null) {
                boolean success = chess.addPlayer(session.getId(), p);
                StringBuilder sb = new StringBuilder();
                if (success) {
                    session.setAttribute(Param.ROLE, role);
                }
                sb.append("{'success':").append(success).append(",'players':").append(chess.getJSONPlayers()).append(",'player':'").append(chess.getNextPlayer()).append("', 'role':'").append(role).append("'}");
                out.write(sb.toString());
                return;
            }

            if (Operation.createRoom.equals(op)) {
                out.write("{'success':" + createRoom(room) + "}");
                return;
            }

            if (FiveChessRoom.ROLES.contains(p) && p != null) {
                if (Operation.play.equals(op)) {
                    chess.play(p, playId);
                    out.write(chess.getNextPlayer().toString());
                } else if (Operation.replay.equals(op)) {
                    chess.replay(p);
                    out.write(chess.getJSONReplayRequesters());
                } else if (Operation.message.equals(op)) {
                    if (!Param.isEmpty(message)) {
                        chess.addMessage(p, message);
                    }
                    out.write("success");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.flush();
            out.close();
        }
    }

    private List getReversedRoomKeys() {
        List res = new ArrayList<String>();
        if (getRooms().size() > 0) {
            for (String key : getRooms().keySet()) {
                res.add(0, key);
            }
        }
        return res;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        processRequest(req, resp);
    }

    private Player createPlayer(String p) {
        try {
            return Player.valueOf(p);
        } catch (Exception e) {
            return null;
        }
    }
}

enum Operation {

    play, query, selectRole, reset, replay, createRoom, message
}
